#!/usr/bin/env python3

import argparse
import json
import re
import unicodedata
import zipfile
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from xml.etree import ElementTree as ET


NS = {"main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}

SHEETS = {
    "activities": "xl/worksheets/sheet3.xml",
    "project_locations": "xl/worksheets/sheet4.xml",
    "city_coordinates": "xl/worksheets/sheet5.xml",
}

# Lightweight aliasing for obviously equivalent names while leaving genuinely
# incomplete data visible in the diagnostics.
CITY_ALIASES = {
    "Mancherster": "Manchester",
}

NON_GEOGRAPHIC_LOCATIONS = {
    "Online",
}


def normalize_key(value):
    text = unicodedata.normalize("NFKC", value or "")
    text = text.replace("’", "'").replace("‘", "'").replace("‑", "-")
    text = re.sub(r"\s+", " ", text).strip()
    return text.casefold()


def column_to_number(column_name):
    value = 0
    for character in column_name:
        value = value * 26 + ord(character) - 64
    return value


def read_shared_strings(workbook):
    path = "xl/sharedStrings.xml"
    if path not in workbook.namelist():
        return []

    root = ET.fromstring(workbook.read(path))
    shared_strings = []
    for item in root.findall("main:si", NS):
        shared_strings.append("".join(node.text or "" for node in item.iterfind(".//main:t", NS)))
    return shared_strings


def read_cell_value(cell, shared_strings):
    cell_type = cell.attrib.get("t")
    value_node = cell.find("main:v", NS)
    inline_node = cell.find("main:is", NS)

    if cell_type == "s" and value_node is not None and value_node.text is not None:
        return shared_strings[int(value_node.text)]

    if cell_type == "inlineStr" and inline_node is not None:
        return "".join(node.text or "" for node in inline_node.iterfind(".//main:t", NS))

    if value_node is not None and value_node.text is not None:
        return value_node.text

    return ""


def read_sheet_rows(workbook, sheet_path, shared_strings):
    root = ET.fromstring(workbook.read(sheet_path))
    rows = []

    for row in root.findall(".//main:sheetData/main:row", NS):
        values_by_column = {}
        for cell in row.findall("main:c", NS):
            match = re.match(r"([A-Z]+)", cell.attrib.get("r", ""))
            if not match:
                continue
            column_number = column_to_number(match.group(1))
            values_by_column[column_number] = read_cell_value(cell, shared_strings).strip()

        if not values_by_column:
            continue

        max_column = max(values_by_column)
        rows.append([values_by_column.get(index, "") for index in range(1, max_column + 1)])

    return rows


def rows_to_dicts(rows, expected_headers):
    records = []
    for row in rows[1:]:
        if not any(row):
            continue
        padded = row + [""] * (len(expected_headers) - len(row))
        record = {header: padded[index].strip() for index, header in enumerate(expected_headers)}
        if not any(record.values()):
            continue
        records.append(record)
    return records


def resolve_city(city_lookup, city_name):
    if not city_name:
        return None, None

    alias = CITY_ALIASES.get(city_name, city_name)
    resolved = city_lookup.get(normalize_key(alias))
    return resolved, alias


def record_issue(issue_map, key, extra=None):
    bucket = issue_map.setdefault(
        key,
        {
            "label": key,
            "count": 0,
            "examples": [],
        },
    )
    bucket["count"] += 1
    if extra and len(bucket["examples"]) < 3 and extra not in bucket["examples"]:
        bucket["examples"].append(extra)


def serialize_issue_counter(issue_map):
    return sorted(issue_map.values(), key=lambda item: (-item["count"], item["label"]))


def build_dataset(workbook_path):
    workbook_path = Path(workbook_path).expanduser().resolve()

    with zipfile.ZipFile(workbook_path) as workbook:
        shared_strings = read_shared_strings(workbook)

        activity_rows = read_sheet_rows(workbook, SHEETS["activities"], shared_strings)
        project_rows = read_sheet_rows(workbook, SHEETS["project_locations"], shared_strings)
        city_rows = read_sheet_rows(workbook, SHEETS["city_coordinates"], shared_strings)

    activities = rows_to_dicts(
        activity_rows,
        [
            "project_name",
            "activity_name",
            "activity_location",
            "activity_focus",
            "activity_audience",
            "relationship",
        ],
    )

    project_locations = rows_to_dicts(
        project_rows,
        [
            "project_name",
            "lead_organisation",
            "city",
        ],
    )

    city_coordinates = rows_to_dicts(
        city_rows,
        [
            "city",
            "lat",
            "lon",
        ],
    )

    project_lookup = {
        normalize_key(record["project_name"]): {
            "project_name": record["project_name"],
            "lead_organisation": record["lead_organisation"],
            "city": record["city"],
        }
        for record in project_locations
        if record["project_name"]
    }

    city_lookup = {}
    for record in city_coordinates:
        if not record["city"] or not record["lat"] or not record["lon"]:
            continue
        city_lookup[normalize_key(record["city"])] = {
            "city": record["city"],
            "lat": float(record["lat"]),
            "lon": float(record["lon"]),
        }

    connection_records = []
    project_summaries = {}

    missing_project_locations = {}
    missing_project_coordinates = {}
    missing_activity_locations = {}
    missing_activity_coordinates = {}
    non_geographic_locations = {}
    relationship_counts = Counter()

    for index, activity in enumerate(activities, start=1):
        if not (activity["project_name"] or activity["activity_name"] or activity["activity_location"]):
            continue

        project_name = activity["project_name"]
        project_key = normalize_key(project_name)
        project_record = project_lookup.get(project_key, {})

        relationship = activity["relationship"] or "Unspecified"
        relationship_counts[relationship] += 1

        project_city = project_record.get("city", "")
        lead_organisation = project_record.get("lead_organisation", "")
        project_coords, resolved_project_city = resolve_city(city_lookup, project_city)

        activity_location = activity["activity_location"]
        activity_coords = None
        resolved_activity_city = None
        is_non_geographic = activity_location in NON_GEOGRAPHIC_LOCATIONS
        if activity_location and not is_non_geographic:
            activity_coords, resolved_activity_city = resolve_city(city_lookup, activity_location)

        missing_reasons = []

        if not project_record:
            missing_reasons.append("missing_project_location")
            record_issue(missing_project_locations, project_name, activity["activity_name"])
        elif not project_city:
            missing_reasons.append("missing_project_city")
            record_issue(missing_project_locations, project_name, activity["activity_name"])
        elif not project_coords:
            missing_reasons.append("missing_project_coordinates")
            record_issue(missing_project_coordinates, project_city, project_name)

        if not activity_location:
            missing_reasons.append("missing_activity_location")
            record_issue(missing_activity_locations, "Blank activity location", activity["activity_name"])
        elif is_non_geographic:
            missing_reasons.append("non_geographic_activity_location")
            record_issue(non_geographic_locations, activity_location, activity["activity_name"])
        elif not activity_coords:
            missing_reasons.append("missing_activity_coordinates")
            record_issue(missing_activity_coordinates, activity_location, activity["activity_name"])

        is_mappable = not missing_reasons

        connection = {
            "id": f"connection-{index}",
            "project_name": project_name,
            "project_city": project_city,
            "project_city_resolved": resolved_project_city,
            "project_lead_organisation": lead_organisation,
            "activity_name": activity["activity_name"],
            "activity_location": activity_location,
            "activity_location_resolved": resolved_activity_city,
            "activity_focus": activity["activity_focus"],
            "activity_audience": activity["activity_audience"],
            "relationship": relationship,
            "project_coordinates": project_coords,
            "activity_coordinates": activity_coords,
            "is_mappable": is_mappable,
            "missing_reasons": missing_reasons,
        }
        connection_records.append(connection)

        summary = project_summaries.setdefault(
            project_name,
            {
                "name": project_name,
                "lead_organisation": lead_organisation,
                "city": project_city,
                "mapped_connections": 0,
                "unmapped_connections": 0,
                "total_connections": 0,
            },
        )
        summary["lead_organisation"] = summary["lead_organisation"] or lead_organisation
        summary["city"] = summary["city"] or project_city
        summary["total_connections"] += 1
        if is_mappable:
            summary["mapped_connections"] += 1
        else:
            summary["unmapped_connections"] += 1

    mappable_connections = [record for record in connection_records if record["is_mappable"]]

    all_points = []
    for connection in mappable_connections:
        all_points.append(connection["project_coordinates"])
        all_points.append(connection["activity_coordinates"])

    unique_cities = {
        normalize_key(point["city"]): point
        for point in all_points
        if point
    }

    project_entries = sorted(project_summaries.values(), key=lambda item: item["name"])

    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source_workbook": str(workbook_path),
        "stats": {
            "total_connections": len(connection_records),
            "mapped_connections": len(mappable_connections),
            "unmapped_connections": len(connection_records) - len(mappable_connections),
            "project_count": len(project_entries),
            "city_count_with_coordinates": len(city_lookup),
            "mapped_city_count": len(unique_cities),
        },
        "relationship_counts": dict(sorted(relationship_counts.items())),
        "projects": project_entries,
        "connections": connection_records,
        "issues": {
            "projects_missing_location_or_city": serialize_issue_counter(missing_project_locations),
            "project_cities_missing_coordinates": serialize_issue_counter(missing_project_coordinates),
            "activity_locations_missing_coordinates": serialize_issue_counter(missing_activity_coordinates),
            "non_geographic_activity_locations": serialize_issue_counter(non_geographic_locations),
            "activities_missing_explicit_location": serialize_issue_counter(missing_activity_locations),
        },
    }


def main():
    parser = argparse.ArgumentParser(description="Generate JSON for the DRI landscape map page.")
    parser.add_argument("workbook", help="Path to the source .xlsx workbook")
    parser.add_argument("output", help="Path to the JSON file to generate")
    args = parser.parse_args()

    dataset = build_dataset(args.workbook)
    output_path = Path(args.output).resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(dataset, indent=2) + "\n", encoding="utf-8")

    print(
        "Generated",
        output_path,
        f"with {dataset['stats']['mapped_connections']} mapped connections",
        f"and {dataset['stats']['unmapped_connections']} unmapped connections.",
    )


if __name__ == "__main__":
    main()

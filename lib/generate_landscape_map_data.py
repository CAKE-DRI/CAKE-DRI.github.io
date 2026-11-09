#!/usr/bin/env python3

import json
import re
import unicodedata
import zipfile
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

WORKBOOK_PATH = Path("DRI explore.xlsx") #path to DRI explore.xlsx
OUTPUT_PATH = Path("./assets/data/landscape-map.json")


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
        ],
    )

    project_locations = rows_to_dicts(
        project_rows,
        [
            "project_name",
            "primary_leader",
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

    for index, activity in enumerate(activities, start=1):
        if not (activity["project_name"] or activity["activity_name"] or activity["activity_location"]):
            continue

        project_name = activity["project_name"]
        project_key = normalize_key(project_name)
        project_record = project_lookup.get(project_key, {})

        project_city = project_record.get("city", "")
        project_coords, _ = resolve_city(city_lookup, project_city)

        activity_location = activity["activity_location"]
        activity_coords = None
        is_non_geographic = activity_location in NON_GEOGRAPHIC_LOCATIONS
        if activity_location and not is_non_geographic:
            activity_coords, _ = resolve_city(city_lookup, activity_location)

        missing_reasons = []

        if not project_record:
            missing_reasons.append("missing_project_location")
        elif not project_city:
            missing_reasons.append("missing_project_city")
        elif not project_coords:
            missing_reasons.append("missing_project_coordinates")

        if not activity_location:
            missing_reasons.append("missing_activity_location")
        elif is_non_geographic:
            missing_reasons.append("non_geographic_activity_location")
        elif not activity_coords:
            missing_reasons.append("missing_activity_coordinates")

        is_mappable = not missing_reasons

        connection = {
            "id": f"connection-{index}",
            "project_name": project_name,
            "project_city": project_city,
            "activity_name": activity["activity_name"],
            "activity_location": activity_location,
            "project_coordinates": project_coords,
            "activity_coordinates": activity_coords,
            "is_mappable": is_mappable,
        }
        connection_records.append(connection)

    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source_workbook": str(workbook_path),
        "connections": connection_records,
    }


def main():
    dataset = build_dataset(WORKBOOK_PATH)
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(dataset, indent=2) + "\n", encoding="utf-8")

    print(
        "Generated",
        OUTPUT_PATH,
        f"from {WORKBOOK_PATH}",
        f"with {len(dataset['connections'])} total connections.",
    )


if __name__ == "__main__":
    main()

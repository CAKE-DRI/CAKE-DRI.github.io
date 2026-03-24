---
layout: title-page
permalink: /landscape/map/
title: DRI Landscape Map
---

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<link rel="stylesheet" href="{{ '/assets/css/landscape-map.css' | relative_url }}">

<p>
  This map is driven by the current DRI explore workbook. Missing project cities, unmatched city
  coordinates, and non-geographic activity locations are kept out of the arc layer and surfaced in
  the dashboard so the page remains useful while the spreadsheet is still being completed.
</p>

{% include landscape-map-dashboard.html %}

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="{{ '/assets/js/landscape-map.js' | relative_url }}"></script>

---
layout: title-page
permalink: /landscape/map/
title: DRI Landscape Map
---

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<link rel="stylesheet" href="{{ '/assets/css/landscape-map.css' | relative_url }}?v={{ site.time | date: '%s' }}">

{% include landscape-map-dashboard.html %}

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="{{ '/assets/js/landscape-map.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>

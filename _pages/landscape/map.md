---
layout: title-page
permalink: /landscape/map/
title: DRI Landscape Map
---

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<link rel="stylesheet" href="{{ '/assets/css/landscape-map.css' | relative_url }}">

<p>
  Explore how DRI projects, activities, and partnerships are connecting across the community.
</p>

{% include landscape-map-dashboard.html %}

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="{{ '/assets/js/landscape-map.js' | relative_url }}"></script>

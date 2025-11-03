---
title: 
layout: funds-collection
permalink: /funds/
collection: funds
entries_layout: grid
sort_by: date
sort_order: normal
classes: wide
---

<pre>funds count: {{ site.funds | size }}</pre>
{% for d in site.funds %}
  <div>{{ d.path }} → {{ d.url }}</div>
{% endfor %}

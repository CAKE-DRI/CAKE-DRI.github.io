
{% assign entries = site[include.collection] %}


{% assign entries = entries | sort: 'date' | reverse %}

{{ entries }}

{%- for entry in entries -%}
  {% include entry.html %}
{%- endfor -%}

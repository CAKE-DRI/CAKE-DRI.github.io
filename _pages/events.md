---
permalink: /events/
title: "DRI events"
---

Below is a list of upcoming events. Want to add one? [Submit a pull request!](https://github.com/YOUR-REPO/events-site)

<ul>
  {% assign events = site.data.events | sort: "date" %}
  {% for event in events %}
    <li>
      <strong>{{ event.title }}</strong><br>
      📅 {{ event.date | date: "%B %-d, %Y @ %H:%M" }}{% if event.end %} – {{ event.end | date: "%H:%M" }}{% endif %}<br>
      📍 {{ event.location }}<br>
      📝 {{ event.description }}<br>
      {% if event.url %}<a href="{{ event.url }}">More info</a>{% endif %}
    </li>
  {% endfor %}
</ul>
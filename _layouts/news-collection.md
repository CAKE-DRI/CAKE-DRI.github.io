---
layout: title-page
---

<div class="project-grid">
  {% include news-collection.html collection="posts" sort_by=page.sort_by sort_order=page.sort_order %}
</div>
<div style="text-align: center; margin-top: 2rem;">
  <a href="{{ '/news-archive/' | relative_url }}" class="btn btn--success btn--x-large">Click here to view all news</a>
</div>

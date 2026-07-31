---
title: Completed CAKE Placements & Visits
permalink: /about/placements/p+v-outputs/
layout: placements
---

## Completed CAKE Placements & Visits

Explore how CAKE Placements & Visits have supported the UK DRI community to attend conferences, visit collaborators, share their work and develop new connections.

* [Reports](#placement--visit-reports)
* [Blogs](#placement--visit-blog-posts)

Interested in applying for funding? <b>[Find out how to apply](/about/placements).</b>

### Placement & Visit Reports

Read reports from researchers who have completed their CAKE Placement or Visit, and find out what they did, where they went and what they gained from the experience.

{% include reports-collection.html collection="reports" sort_by="date" sort_order="reverse" %}

<!-- Not sorting properly... -->

### Placement & Visit Blog Posts

Catch up on the latest news, stories and updates from our Placement & Visit community.

<section class="post-cards">
    {% assign placement_posts = site.posts | where_exp: "post", "post.tags contains 'placements'" %}
    <div class="card">
        {% for post in placement_posts %}
        <div class="card">
            <a href="{{ post.url }}">
            <div class="card-image">
                <img src="{{ post.summary-image }}" alt="{{ post.title }}">
            </div>
            <div class="card-content">
                <h3>{{ post.title }}</h3>
                <div class="card-footer">
                    {% if post.date %}
                    <p class="card-date">
                        <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%d %b %Y" }}</time>
                    </p>
                    {% endif %}
                    <span class="card-link">Read more →</span>
                </div>
            </div>
            </a>
        </div>
    {% endfor %}
    </div>
</section>

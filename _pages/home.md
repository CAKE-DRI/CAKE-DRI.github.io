---
layout: splash
permalink: /
hidden: true
title: Computational Abilities Knowledge Exchange
header:
  overlay_color: "#5e616c"
  overlay_image: /assets/images/home-banner.png
  actions:
    - label: "🎧 Listen to our podcast episode"
      url: "#podcast"
excerpt: >
  The CAKE NetworkPlus facilitates knowledge exchange and sustainable collaboration across the UK Digital Research Infrastructure (DRI) communities. 
feature_row:
  - image_path: /assets/images/landscape/generic/DRI-Landscape-Explore.png
    max-height: "180px"
    alt: "projects"
    title: "DRI Landscape"
    excerpt: "Explore the people, projects and capabilities within UK DRI."
    url: "/landscape/"
    btn_class: "btn--primary"
    btn_label: "Explore the DRI Landscape"
  - image_path: /assets/images/cakebox-logo/CAKEbox.png
    max-height: "180px"
    alt: "resources"
    title: "KE Resources"
    excerpt: "CAKEbox is a community-driven knowledge base of DRI resources."
    url: "https://www.cake.ac.uk/CAKEbox/"
    btn_class: "btn--primary"
    btn_label: "Visit CAKEbox"
  - image_path: /assets/images/fundings_images/Funding.png
    max-height: "180px"
    alt: "Available Funding"
    title: "Funding Opportunities"
    excerpt: "Browse funding opportunities across the DRI landscape."
    url: "/funds/"
    btn_class: "btn--primary"
    btn_label: "View Funding Opportunities"

---

{% assign today_ymd = site.time | date: "%Y%m%d" %} 
{% if today_ymd <= "20261112" %}
<div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .75rem 1.5rem; margin: 0 0 2rem; padding: 1rem 1.5rem; background: #3f5e8a; color: #fff; border-radius: 6px;"> <div> <p style="margin: 0; font-size: .75em; font-weight: bold; letter-spacing: .08em; text-transform: uppercase; color: #ffd3c2;">Call open · closes 12 November 2026</p> <p style="margin: .2rem 0 0; font-size: 1.1em; font-weight: bold;">Become a DRI Knowledge Exchange Fellow</p> <p style="margin: .2rem 0 0; font-size: .9em;">£4,000 to lead a knowledge exchange project in your DRI community, with peer support and mentoring from the CAKE team.</p> </div> <a href="{{ '/about/ke-fellowships/' | relative_url }}" class="btn btn--large" style="background: #f05922; color: #fff; white-space: nowrap;">Find out more &amp; apply →</a> </div> 
{% endif %} 

<!-- Podcast spotlight: remove this block (and header.actions above) when no longer featured --> <section id="podcast" style="margin: 0 0 2.5rem; padding: 1.25rem 1.5rem; background: #f4f6fa; border-left: 6px solid #f05922; border-radius: 6px;"> <p style="margin: 0 0 .25rem; font-size: .75em; font-weight: bold; letter-spacing: .08em; text-transform: uppercase; color: #f05922;">New podcast episode</p> <h2 style="margin: 0 0 .5rem; border: none; color: #3f5e8a;">Hmm… a special CAKE for you</h2> <p style="margin: 0 0 1rem;">CAKE features on <em>Code for Thought</em> — listen to hear what we're doing across UK Digital Research Infrastructure.</p> <iframe src="https://www.buzzsprout.com/1326658/episodes/19961379-en-hmm-a-special-cake-for-you?client_source=small_player&iframe=true" loading="lazy" width="100%" height="200" frameborder="0" scrolling="no" title="Code for Thought, [EN] Hmm... a special CAKE for you"></iframe> </section>

{% include feature_row %}    

<div style="text-align: center; margin-top: 2rem;">
  <a href="{{ '/about/who-are-we#get-involved' | relative_url }}" class="btn btn--secondary btn--x-large">How to get involved with CAKE</a>
</div>

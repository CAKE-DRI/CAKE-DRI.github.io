---
title: CAKE Placements & Visits
permalink: /about/placements/
layout: placements
---
<br>

# CAKE Placements & Visits 

<!-- <div style="display: flex; justify-content: center; gap: 10px;">
  <img src="/assets/images/CAKE-placements-banner.png" width="90%">
</div> -->

<!-- * TOC
{:toc} -->

<!-- <br> -->

**CAKE Placements & Visits** support the UK DRI community to build new collaborations and strengthen existing ones through flexible funding for travel, subsistence, and in-person or remote placements and visits. 

Applications are open year-round, with decisions typically made within 4–6 weeks.

<div style="text-align: center; margin-top: 2rem;">

  <div class="quick-facts">
  <span>✈️ Travel & subsistence funding</span>
  <span>🌍 UK & international collaborations</span>
  <span>🤝 In-person & <a href="https://www.cake.ac.uk/CAKEbox/collaboration-and-community-building/virtual_placements/">remote placements</a></span>
  <span>📅 Rolling applications</span>
  <span>⏱ Decisions in 4–6 weeks</span>
  <span>🎓 PhD students eligible</span>
  </div>

  <br>

  <a href="{{ 'https://forms.gle/qe5jCLPkBJ9tGNKg6' | relative_url }}" class="btn btn--secondary btn--x-large">Apply now</a>
</div> 


## What we fund: 

We support activities that enable collaboration, two-way knowledge exchange, and shared research development, creating benefits for both hosts and applicants:

<div class="placement-grid">
<div class="placement-card">
<h3>🏢 In-person placements</h3>
<p>Spend time embedded in another group to share knowledge, methods and ideas.</p>
</div>

<div class="placement-card">
<h3>💻 Remote placements</h3>
<p>Collaborate flexibly when travel is not possible or practical.</p>
</div>

<div class="placement-card">
<h3>🌍 International </h3>
<p>Travel to or host international collaborators.</p>
</div>

<div class="placement-card">
<h3>🤝 Workshops & Events</h3>
<p>Attend community meetings, training and networking events.</p>
</div>
</div>

<div class="notice--success">
💡 <strong>Not sure if your idea fits?</strong><br> The scheme is intentionally flexible, so get in touch and we can help shape your idea or match you with potential collaborators.
</div>
 
<div class="columns">
<div>
<h3>Benefits:</h3> 

Placements and visits are designed to create space for meaningful collaboration beyond day-to-day research.

<div class="checklist">
<div>🤝   Time to explore new collaborations and ideas</div>
<div>🤝   Opportunity to share skills and learn new approaches</div>
<div>🤝   Access to new environments and perspectives</div>
<div>🤝   Strengthening connections across the UK DRI community and beyond</div>
</div>
</div>

<div>
<h3>Eligibility:</h3>

Funding is open to researchers across the UK DRI community and wider UKRI-eligible institutions.

<div class="checklist">
<div>✅   Based at a UKRI-eligible institution</div>
<div>✅   Funding awarded at 80% Full Economic Cost (FEC)</div>
<div>✅   Host institution must cover remaining 20%</div>
<div>✅   PhD students welcome with supervisor support</div>
</div>
</div>
</div>

### Need inspiration? Read the latest CAKE Placement & Visit blog posts

<section class="post-cards">
    {% assign placement_posts = site.posts | where_exp: "post", "post.tags contains 'placements'" %}
    <div class="card-grid">
        {% for post in placement_posts limit:4 %}
        <div class="card">
            <a href="{{ post.url }}">
            <div class="card-image">
                <img src="{{ post.summary-image }}" alt="{{ post.title }}">
            </div>

            <div class="card-content">
                <h3>{{ post.title | truncatewords: 5 }}</h3>
                <p class="card-excerpt">{{ preview }}</p>
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


<br>

---

<br>

# Application information

- [Eligibility](#eligibility)
- [Timeline](#timeline)
- [Application process](#application-process)
- [Outputs](#outputs)
- [Contact](#contact)

CAKE Placements & Visits are designed to spark new collaborations across the UK DRI community by creating opportunities for researchers to connect, exchange ideas, and develop new ways of working.

The scheme primarily funds travel and subsistence costs, making it easier for researchers to undertake placements and visits that would otherwise be difficult to support. The programme is intentionally flexible, enabling collaborations that may not fit within traditional funding schemes.

### Eligibility 

Applicants must:

* Be based at a [UK institution eligible for UKRI funding.](https://www.ukri.org/publications/organisation-eligibility/research-organisations-eligible-for-ukri-funding/)
* Confirm that their institution can provide the remaining 20% contribution, as awards are made at 80% Full Economic Costing (FEC).
    * Check if your organisation has confirmed their support for staff joining CAKE activities [here](/opportunities/).

Additional information:

* Funding may support international travel, including the travel expenses of collaborators visiting the UK.
* PhD students are welcome to apply but must submit a letter of support from their primary supervisor alongside their application.

We are committed to building a diverse and inclusive CAKE community and welcome applications from researchers of all backgrounds, disciplines, and career stages.

### Timeline 

The programme runs from October 2025 through to April 2028, at which time all visits must be complete and expenses claimed.

### Application process 

Applications are assessed on a rolling monthly basis. Decisions are typically communicated within 4–6 weeks.

Each application is reviewed by at least three members of the CAKE Review Committee, using the following reviewing criteria:
* Importance of the benefits from this visit and UKRI-wide relevance of specific outputs (40%), 
* Potential to drive long term collaboration (20%), 
* Eminence of the partners in HPC and/or the specific field being investigated (10%), 
* Appropriateness of the time plan and value for money (10%), 
* Consideration of environmental impact (10%), 
* Link to DRI projects and activities (10%).

For larger awards (over £6,000) or requests outside travel and subsistence costs, applicants should contact the CAKE management team at [cake@jiscmail.ac.uk](cake@jiscmail.ac.uk) before applying.

Successful applicants will be notified directly and provided with details on how funding will be administered.

### Outputs

All successful applicants are required to:

* Submit a short written report outlining activities and outcomes
* Contribute a blog post for the CAKE website
* Documentary evidence must be kept to show how the allocated funds have been spent.


<div style="text-align: center; margin-top: 2rem;">
  <a href="{{ 'https://forms.gle/qe5jCLPkBJ9tGNKg6' | relative_url }}" class="btn btn--secondary btn--x-large">Apply here!</a>
</div>


### Contact 

If you have any questions about eligibility, developing an idea, or preparing an application, please get in touch:

📧 **cake@jiscmail.ac.uk**

We’re happy to help!



<!-- 
## EDI

REMOVED while refactoring 

To support this commitment, we provide: 
* [A structured framework to help hosts and participants get the most from their placement or visit - whether virtual or in-person](#structured-framework-for-placements-and-visits)
* [Mentoring opportunities for all applicants](#mentoring-opportunities)
* [Match-making support to connect participants and hosts](#match-making-support)
* [Best practices for successful placements and visits](https://www.cake.ac.uk/CAKEbox/collaboration-and-community-building/) 
* [Guidance for reviewers to support fair, respectful, and constructive reviews](https://www.cake.ac.uk/CAKEbox/submissions-and-reviews/)

---

<br>

# Support 

**Coming soon!**
We have several support opportunities that will soon be in place to help you make the most of your placements and visits. In the meantime, please contact the CAKE management team, who are very happy to assist, helping you navigate options and connect with the right collaborators.

## Structured Framework for Placements and Visits

We’re developing a clear framework to help participants and hosts get the most out of every placement and visit. Stay tuned for guidance, templates, and tips to make your experience as productive and rewarding as possible.

## Mentoring Opportunities 

CAKE will soon offer mentoring support for all applicants, connecting you with experienced members of the network to guide your placement, provide advice, and help you achieve your goals.

## Match-making Support 

We’re building tools and support to help participants find the right hosts, and vice versa, so that collaborations are effective, meaningful, and aligned with your research interests.
 -->

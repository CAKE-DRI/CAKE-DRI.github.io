# Welcome to the CAKE website! 


This repository hosts the website for the **Computational Abilities Knowledge Exchange (CAKE)** project.

CAKE supports knowledge exchange across the UK Digital Research Infrastructure (DRI) community by connecting people, projects, and activities through a central hub. This makes it easier to discover what’s happening across the landscape and identify opportunities for collaboration.

To help us maintain a complete and up-to-date picture, please consider contributing your:
- [Projects](https://www.cake.ac.uk/landscape/)
- [Events](https://www.cake.ac.uk/events/)
- [Funding opportunities](https://www.cake.ac.uk/funds/)
- [News](https://www.cake.ac.uk/news/)

You can contribute by:
- Creating a pull request on GitHub  
- Contacting the CAKE team for support  
- Submitting via our online forms:
  - [Add a project](https://www.cake.ac.uk/landscape/add_project/)
  - [Add an event](https://www.cake.ac.uk/events/add/)

---

## Adding Content via GitHub (Pull Requests)

Community-contributed content is organised into collections within the `collections` folder:

- `funds` — funding opportunities  
- `events` — events  
- `posts` — news and blog articles  
- `projects` — DRI landscape categories  

To add new content, create a `.md` file in the appropriate collection folder.

### To make a pull request:  
- Create a [GitHub](https://github.com) account.
- Fork the [repository](https://github.com/CAKE-DRI/cake.github.io).
- Create a new branch and make your changes there.
- Commit your changes.
- Issue a pull request against the master repository/branch.
- Your pull request will be reviewed at the earliest convenience, we will provide feedback, and eventually merge the updated changes into the master repository.

More information on how to contribute can be found on CAKEBox: [https://www.cake.ac.uk/CAKEbox/how-to-contribute/](https://www.cake.ac.uk/CAKEbox/how-to-contribute/)


---

### Adding a funding opportunity 

Create a new `.md` file under `collections/_events` for your funding opportunity, using the following template: 

```bash 
---
title: Funding title
layout: landscape
image: assets/images/fundings_images/your_image.png       # Upload a new image, use a URL, or select from our existing generic ones in here: `assets/images/`
contact: "cake-management@mlist.is.ed.ac.uk"
web-page: "https://www.cake.ac.uk/opportunities"
closing_deadline: 2026-5-19
format: deadline
---

Provide a description of the funding opportunity here.
```

#### Funding Formats

The `format` and `closing_deadline` fields determine how opportunities are displayed:

| `format` | `closing_deadline` | Type | 
| ---- | ----| ---| 
| `deadline` | future date | Funding calls with deadlines | 
| `deadline` | past date | Closed opportunities | 
| `open` | no date | Always open calls | 
| `future` | no date | Upcoming opportunities | 


## Adding an event 

Create a new `.md` file under `collections/_events` for your event, using the following template: 

```bash 
---
title: "Event Title"
icon_alt: Award icon
categories:
  - National                  # Or international
group: events
start_date: 2025-05-11              # Use YYYY:MM:DD
date: 2025-05-14              # Use YYYY:MM:DD
layout: event
image: assets/images/event-images/your-event-image.png      # Upload a new image, use a URL, or select from our existing generic ones in here: `assets/images/`
project-type: National Event              # Or international
web-page: https://www.your-url-for-cake-event.ac.uk
location: Edinburgh, UK
summary: An optional summary to display, otherwise it will use the first bit of the text content
---

This is the content for the event, lots of information can be added here
```


## Adding a post or blog article 

Create a new `.md` file under `collections/_posts` for your post, using the following template: 

```bash 
---
title: "Blog title"
date: 2026-02-23
full-width: true 
classes: wide
summary-image: /assets/images/your_image.png      # Upload a new image, use a URL, or select from our existing generic ones in here: `assets/images/`
categories:
  - news
tags:
  - RSE
  - community
---

This is the content for the blog, lots of information can be added here. Check out previous blog posts for inspiration on how to display yourself as an author, embedding images or fun content! 
```


## How to: add your DRI project 

If your project is not yet listed or needs updating, identify the relevant DRI area:
* Systems
* New approaches to software
* New approaches to skills
* Embedded GPU CSE
* RTP skills, hubs and platforms
* Research communities
* Centres and institutes

If your project does not fit one of these categories, please contact the CAKE team.

Each category has its own directory under `collections`. Projects are stored as individual `.md` files.

```bash 
---
title: "Project"
group: landscape-ecse-gpu     # Select the appropriate one based on your rubric
layout: post
image: assets/images/project-images/project_1.webp      # Upload a new image, use a URL, or select from our existing generic ones in here: `assets/images/`
contact: Test Person
contact-link: test@test.com
web-page: https://www.your-url-for-project.ac.uk
---

This is the content for the project, lots of information can be added here. 
```

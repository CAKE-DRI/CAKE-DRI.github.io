# Welcome to the CAKE website! 

Want to show off your projects, events or add to our website? 

To make a contribution: 
- Create a [GitHub](https://github.com) account.
- Fork the [repository](https://github.com/CAKE-DRI/cake.github.io). The fork should end up in your own account.
- Create a new branch and make your changes there.
- Commit your changes.
- Issue a pull request against the master repository/branch.
- Your pull request will be reviewed at the earliest convenience, we will provide feedback, and eventually merge the updated changes into the master repository.

## How to: add an upcoming event 

Create a new `.md` file under `collections/_events` for your event, using the following template: 
```bash 
---
title: "Event"
icon_alt: Award icon
categories:
  - National
group: events
date: 2025-05-14
layout: post
image: assets/images/event-images/your-event-image.png
project-type: National Event
web-page: https://www.your-url-for-cake-event.ac.uk
location: Where this will be held
summary: An optional summary to display (otherwise it will use the first bit of the text content
---

This is the content for the event, lots of information can be added here
```

If you wish, add an image into `assets/images/event-images/your_event_image_here.webp` and update the above template. 

## How to: add your DRI project 

<!-- What is a DRI project? 
Who do we want to add to here? -->

Create a new `.md` file under `collections/_projects` for your project, using the following template: 
```bash 
---
title: "Project"
icon_alt: Award icon
categories:
  - Projects
group: projects
layout: post
order: 1
image: assets/images/project-images/project_1.webp
project-type: Training
contact-name: Test Person
contact-email: test@test.com
web-page: https://www.your-url-for-project.ac.uk
---

More information soon to be added! 
```

If you wish, add an image into `assets/images/project-images/your_project_image_here.webp` and update the above template. 

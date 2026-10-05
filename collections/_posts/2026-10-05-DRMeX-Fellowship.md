---
title: "DRMeX Fellowship"
date: 2026-10-05
full-width: true 
classes: wide
summary-image: https://drmex.qiuip.uk/assets/logo-full.svg
categories:
  - news
tags:
  - knowledge exchange
  - fellowships
---

*Mashy Green, Advanced Research Computing Center (ARC), University College London, mashy.green@ucl.ac.uk*


## The generalist's itch

When I first joined UCL ARC as a research software engineer in 2024, I had to
transition from being a domain expert in my field, to working in a centralised
generalist team on all kinds of research projects I knew very little about. In
our weekly meetings where people were presenting their work, I started to
realise just how wide a range of research our group spans and the fascinating
projects and codes. I often heard about some code we helped develop that could
[analyse animal tracking data](https://github.com/SainsburyWellcomeCentre/WAZP)
or create an [atlas of a
brain](https://github-pages.ucl.ac.uk/NextBrain/#/home), [emulate the cosmic
microwave background](https://github.com/CosmologicalEmulators/Capse.jl),
[model human responses to
emergencies](https://doi.org/10.1016/j.ijdrr.2020.101657), [map genomes of
understudied pathogens](https://doi.org/10.1099/mic.0.001366) or [map endangered
archaeological sites](https://maeasam.org/).

In all these talks, I learned a lot about what the projects were about, why they
are important, what scientific impact they can make and how our work
contributed to them - all of the achievements that deserve to be celebrated.
However, too often, I was also left feeling like something, at least to me, was
missing. I was left wondering "How would I deal with working on this project?",
"What does the code that did that bit actually look like?" and "How do the
methods that were used actually solve this problem?". I realised that, for the
first time, I have the opportunity to gain real insights into so many cool new
computational methods I have never heard about, and I also bet that many of
these methods have some familiar components to them. Maybe, I could learn of
other communities that solve the same kind of numerical problems I encounter but
in a different or better way? Maybe next time I need to clean up a noisy force
signal from an experiment I'll actually know about a few of the methods that
exist and I would know to ask the right questions so I could find better
solutions? I got curious, and I **have** to know more.  

If you are anything like me, I'm sure you can recall numerous long and detailed
talks in seminars and conferences where the speaker presented all these cool
looking advancements with this or some other method that they developed in their
code, but I found very difficult to follow as I had little to no familiarity
with what they were talking about - although the handful of people that were
more familiar with it seemed quite enthusiastic. This made me think if maybe we
could find a way to share just enough background on such work so that more of us
could follow along? If we could, would there be some bits and pieces so that
if/when we encounter some research project doing similar things we might be able
to use these ideas? Maybe we could even find parallels to other problems we
worked on and find novel ways of applying techniques developed for this method
to a totally unrelated problem that has a similar abstract shape?

## Pollinators <img src="https://qiuip.github.io/assets/images/bee-pollinator.jpg" alt="Illustration of a bee carrying pollen" style="height: 50px; width: 50px; display: inline-block; vertical-align: middle; border-radius: 50%; margin: -10px 0 -10px 0.4em;">

Then it hit me - digital research technology professionals and research software
engineers have the potential to be the perfect pollinators of cross-domain
knowledge exchange. We can pick up the core computational implementation of the
methods which we work on and carry it with us to other projects! There aren't
many roles where highly technical people get to work across such a wide range of
domains as us, and the technical know-how we bring can not only improve the
quality and sustainability of research software, implement some features or
improve its performance, but we can also help shape it based on the knowledge
we can bring from across all the different projects we collectively have
encountered. But for that, we must start discussing the 'how', and to do that,
we need to start building a larger vocabulary of methods we are at least
conceptually familiar with so these discussions can start taking place.  

## Testing it out at ARC

To try this concept out, I started a small initiative at ARC called ARC
Computational Methods Exchange (ACME) - which led to lots of fun memes in the
talks! - where I had the opportunity to learn a bit about Automatic
Differentiation and Neighbour Searching with CUDA.

![ACME acronym slide](https://qiuip.github.io/assets/images/acme-acronym-slide.jpg){: style="max-width: 480px; width: 100%; display: block; margin: 1rem auto;" }

These talks however were delivered to our High Performance Computing (HPC)
sub-group, which was a bit like preaching to the choir. Eventually, I found a
spot in our weekly wider meetings, ARC Forum, where I was able to present a
session on Numerical Differential Equations to the wider ARC group. The talk was
inspired by a previous talk I gave a few years back in a Doom emacs online
meet-up, titled "From High-school maths to Computational Fluid Dynamics" where I
started off with introducing what a derivative is and built up to applying
finite differences to the Euler equations. That talk was very informal and not
that well structured, so I rewrote it in the format of an [interactive Pluto
notebook](https://github.com/UCL-ARC/NDE) and worked hard to ensure it could be
followed by everyone from our research managers who have little to no coding
experience, to seasoned HPC developers, and limited the scope to fit in 30
minutes.  

My talk was followed by another researcher at ARC who presented the concepts of
our funding application for a multi-disciplinary project combining numerical
methods with imaging techniques to create a bio-mechanical solver - a project
that was directly inspired by ACME. Unfortunately, the project did not get
funded, but we will certainly try again!  

This experience convinced me I was on to something worth pursuing as real
RSE-led research ideas were sprouting out of this, and I just loved to see our
research manager playing around with the notebook and enjoying being included in
"technical talks"!

## Taking it national

The talk at ARC received great feedback, and there was quite a bit of enthusiasm
by others to create their own talks on methods they would like to share, but I
realised the amount of effort required to create such content would be wasted if
it was limited just to ARC. I decided to try and find a platform where I could
take the concept nationally and applied for a [<img
src="https://qiuip.github.io/assets/images/cake-logo.png" alt="CAKE logo" style="height: 15px; width:
auto; display: inline-block; vertical-align: middle; margin: 0 0.3em 0 0;">knowledge exchange fellowship](https://www.cake.ac.uk/about/ke-fellowships/),
renaming ACME to Digital Research Methodological eXchange (DRMeX), which I was
overjoyed to have gotten funded! (and only a little sad I wasn't able to keep
ACME as the name for the memes...) The fellowship will allow me to visit
different dRTP and RSE groups across the UK to give a talk about the initiative,
deliver a sample talk, gain feedback on what participants would like to get out
of it and how the concept could be improved, and crucially recruit participants
and presenters for a DRMeX workshop I will run in mid to late 2027.

## Get involved

If any of this seems interesting to you and you would like to participate,
invite me to give a talk to your group or present some method you are excited
about, please visit the [DRMeX webpage](https://drmex.qiuip.uk) or [contact
me](mailto:mashy.green@ucl.ac.uk) as I would love to discuss this with you!

---

*Bee illustration: Designed by [Magnific](https://www.magnific.com)*

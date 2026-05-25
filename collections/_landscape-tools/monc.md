---
title: MONC GPU Acceleration
group: landscape-ecse-gpu
layout: landscape
image: assets/images/landscape/monc.png
contact: Nick Brown
contact-link: https://www.epcc.ed.ac.uk/about-us/our-team/dr-nick-brown
---

The Met Office NERC Cloud model (MONC) is a Fortran 2003 toolkit for high resolution atmospheric simulation. Initially developed by the Met Office and EPCC, this model has become popular with the UK atmospheric modelling community and performs and scales well on ARCHER2.

With outputs from MONC feeding into weather and climate models, the ability for MONC to leverage GPUs will enable the modelling of larger systems at increased resolution, which will unlock new scientific possibilities in atmospheric modelling such as a better understanding of deep convection and modelling of boundary layer turbulence.

In this project we will port MONC to AMD and Nvidia GPUs, first using OpenMP target offload and then as required using HIP (for AMD) and CUDA (for Nvidia) to specialise for high performance. We will also develop a dynamic load balancing scheme across the CPU and GPU, as well as ensuring that GPUs can communicate directly to avoid the CPU becoming a bottleneck.

IO is also an important part of the model, and we will enhance MONC IO with ADIOS2 to provide compatibility with data generated on the GPU, and ensure that the IO is able to keep up with the increased computation capability. Lastly we will undertake dissemination and knowledge exchange, running 2 workshops and developing documentation.

MONC is open source and made available under a BSD 3-clause licence, and as such, all improvements will be made available to ARCHER2 and other HPC machine users.

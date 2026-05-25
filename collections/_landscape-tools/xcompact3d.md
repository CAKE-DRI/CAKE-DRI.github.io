---
title: Porting XCompact3D to AMD GPUs
group: landscape-ecse-gpu
layout: landscape
image: assets/images/landscape/generic/generic_3.jpg
contact: Sylvain Laizet
contact-link: https://profiles.imperial.ac.uk/s.laizet
web-page: https://github.com/xcompact3d
---

This project will port the x3d2 code, which already has NVIDIA GPU support to AMD GPUs. We will achieve this by implementing a vendor-agnostic backend based on OpenMP Target offloading with specific kernels identified for AMD-specific implementations using HIP, following profiling.

The Xcompact3D code is widely used for various research in fluid dynamics, including studies of fundamental turbulent flows and simulation, analysis and optimisation of wind farms. The x3d2 code is a new development effort initiated by the PI/lead developer of Xcompact3D to enable using GPUs and ensure users can continue to use the largest Exascale machines. The eventual aim is to support the full range of problems Xcompact3D currently does.

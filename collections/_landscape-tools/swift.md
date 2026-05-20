---
title: SWIFT - Facilitating performance-portable GPU acceleration in a task-based massively parallel SPH solver
group: landscape-ecse-gpu
layout: landscape
image: assets/images/landscape/generic/generic_0.jpg
contact: Abouzied Nasar
contact-link: https://research.manchester.ac.uk/en/persons/abouzied.nasar
---

This project aims to facilitate performance-portable GPU acceleration of the task-parallel Smoothed Particle Hydrodynamics Astrophysics solver SWIFT. This endeavour is founded on and expands our previous successful proof-of-concept work with CUDA.

In this proposed project, we intend to port existing proof-of-concept CUDA code for performance-portable heterogeneous architectures using the Kokkos library, enabling us to target AMD, Nvidia, and Intel GPUs in a future-proof manner. Furthermore, we intend to optimise the code's performance by adapting more of the currently CPU-only algorithms for use with GPUs. Finally, we aim to research and implement optimal strategies to address bottlenecks in the GPU code identified through our previous work which are: 
- Host-side data re-arrangement and storage time: We aim to investigate and implement host side data structure storage strategies which are suited for GPU acceleration in order to overcome and minimise this bottleneck.
- Intermittently inefficient host-device data transfer and device computations: We aim to implement selective dynamic scheduling of tasks onto CPUs instead of GPUs for cases where GPU offloads lead to performance degradation due to small offload size.

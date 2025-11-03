---
title: Developing a heterogeneous SPH solver based on the DualSPHysics GPU codes
group: landscape-ecse-gpu
layout: landscape
image: assets/images/landscape/generic/generic_6.jpg
contact: Ben Rogers
contact-link: https://research.manchester.ac.uk/en/persons/benedict.rogers
---

The meshless method smoothed particle hydrodynamics (SPH) is revolutionising the simulation of hydrodynamics in complex multi-physics problems. As one of the leading open-source SPH codes, DualSPHysics has successfully been applied to a range of fields including waves impacting coastal/offshore structures, wave energy converters, fuel tank sloshing in vehicles, nuclear waste and many others. However, the current version is restricted to single-GPU (NVIDIA)/single-node CPU operation. Future target applications (simulations of full offshore wind farms, full flood inundation of urban coastal regions) require significantly more particles (billions) than currently possible.

The aim of this project is to extend both the availability and capability of DualSPHysics by providing a hardware-agnostic implementation that can run on the heterogenous large-scale distributed systems now appearing. The new implementation will enable ambitious science and engineering research in the drive for net zero, future sustainability, and infrastructure resilience.

We propose the following key advances:
1. Develop a performance portable version of DualSPHysics for heterogenous systems
2. Reduce/eliminate platform-specific code for enhanced productivity
3. Develop a multi-GPU version of DualSPHysics for large-scale distributed systems
4. Merge/integrate new developments into official release cycle of DualSPHysics
5. Disseminate new capability to accelerate uptake & enable new science

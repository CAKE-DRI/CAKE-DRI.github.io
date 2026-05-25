---
title: GPU Acceleration of Phonon Calculations with CASTEP
group: landscape-ecse-gpu
layout: landscape
image: assets/images/landscape/castep.png
contact: Phil Hasnip
contact-link: https://www-users.york.ac.uk/~pjh503/
---

CASTEP is the UK’s leading materials modelling software, using density functional theory (DFT) to predict materials’ properties. The current focus is on accelerating CASTEP’s performance on GPU-based high-performance computing systems. Here CASTEP-GPU will offload key calculations, especially for phonon studies, to GPUs, significantly improving computational speed and efficiency while ensuring portability across platforms.

The major goal is to accelerate phonon calculations using both finite-displacement and density-functional perturbation theory methods, which are critical for studying vibrational and thermal properties. This also enhances geometry optimization and molecular dynamics simulations, benefiting all CASTEP users. Additionally, the project aims to reduce GPU memory usage, enabling larger and more complex calculations that are currently challenging on standard GPU setups.

Our work will improve multi-GPU parallelism, particularly in handling G-vector parallelism during phonon calculations, and will enhance scaling and reduce latency. Expanding support for AMD GPUs will make CASTEP compatible with new HPC systems like Frontier and LUMI, broadening its use.

These developments will lead to a minimum speed-up of 3.8X, allowing for faster scientific results and improving energy efficiency. Researchers in fields such as thermoelectrics and vibrational spectroscopy will benefit, with updates integrated into CASTEP and distributed globally.

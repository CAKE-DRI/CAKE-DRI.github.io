---
title: Accelerated and differentiable spherical transforms
group: landscape-ecse-gpu
layout: landscape
image: assets/images/landscape/generic/generic_7.jpg
contact: Jason McEwen
contact-link: http://www.jasonmcewen.org/
---

Many fields of science and engineering encounter data on spherical manifolds. The diversity of applications is remarkable, ranging from geophysics, exoplanets, and climate, to early and late Universe cosmology, to biomedical imaging and molecular chemistry, and far beyond, such as gravitational waves and computer vision. The analysis of spherical data requires the construction of mathematical methods, such as the Fourier transform, wavelets, and artificial intelligence (AI) models, on spherical manifolds. The focus of the proposed project is to improve and extend the s2* code

suite developed previously by the project team, which provides functionality to compute the generalised Fourier transform defined on the sphere---also called the spherical harmonic transform---and related spherical transforms, such as wavelets, scattering and convolutional neural networks (CNNs) defined on the sphere. The s2*code suite includes underlying algorithms redesigned from the ground up to support the high throughput computing of modern hardware accelerators, such as GPUs, and to support automatic differentiation. Exploiting GPUs is essential to render spherical transforms computationally feasible for the very large datasets and models encountered in practical applications, while support for automatic differentiation is critical to unlock the potential of differentiable programming for hybrid data-driven and model-based approaches.

---
title: GCRYSTAL - A GPU enabled CRYSTAL
group: landscape-ecse-gpu
layout: landscape
image: assets/images/landscape/generic/generic_1.jpg
contact: Ian J Bush
---

The work is to produce a production quality GPU enabled version of CRYSTAL, a general purpose electronic structure application. Being such a flexible package the work can potentially impact a wide range of areas. Recent use cases for CRYSTAL include batteries, solar cells, energy storage and conversion, CO2 recycling and sequestration, homogenous and heterogeneous catalysis, surface science, novel materials, ferro/pyroelectrics thermoelectrics, electrocalorics, nano-electronics and spintronics

The work will focus on the Self-Consistent Fields (SCF) procedure. This is the fundamental procedure, without it no other calculations are possible. As such the proposed work will impact all uses of CRYSTAL. To achieve this the required steps are
- GPU enabled evaluation of the Hartree-Fock terms in the Hamiltonian
- GPU enabled evaluation of the Exchange and Correlation DFT terms within the Hamiltonian
- GPU enabled linear algebra

To support the user base this needs to be portable across as many architectures as possible, as such we shall use OpenMP with a mix of C++ and Fortran for the project. The new code will be released to the community via the standard CRYSTAL distribution mechanisms

---
title: "Theory Paper: Frequency-Dependent Distortion in Class II Ceramic Capacitors: Physics and Simulation Traps"
date: "2026-06-27T13:09:38+06:00"
excerpt: "A short theoretical review examining signal distortion in RC networks using Class II ceramic capacitors, and its impact on ADC front-end design."
author: "Boris Kuznetsov"
---

While working on the next video in my series on analog-to-digital converters, I took a closer look at ADC input networks. During that work, I realized that many practical aspects of using RC networks at the input of an ADC are not always described in enough detail. This is especially true when these networks are discussed specifically in the context of ADC front-end design.

One particularly interesting case is an RC network that uses Class II ceramic capacitors. These capacitors are widely used in electronics, but their behavior can depend on frequency, voltage, and operating conditions. As a result, they can introduce subtle signal distortion that may not be obvious during the initial design stage, but can become important in ADC input filters, anti-aliasing networks, and signal-conditioning circuits.

I prepared a short theoretical review to examine what actually happens to the signal in these RC networks. The results of this analysis are presented in my paper:

**Theory Paper: Frequency-Dependent Distortion in Class II Ceramic Capacitors: Physics and Simulation Traps**
DOI: **[10.31224/7436](https://doi.org/10.31224/7436)**

I hope this material will be useful for engineers working on ADC front ends, precision measurement circuits, embedded signal acquisition, or analog signal processing. If you have ever seen measurement instability, unexpected distortion, or a mismatch between simulation results and the real behavior of an ADC input network, this paper may help clarify the underlying physics and point out several common design and simulation traps.

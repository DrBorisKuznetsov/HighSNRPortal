# Mathematical Reference

This document provides the foundational equations and mathematical models used in the Passive Filter Distortion Analyzer.

## Linear AC Analysis

For linear analysis, the components are considered ideal. The solver uses standard nodal analysis to derive the transfer function $H(s)$, where $s = j\omega$ and $\omega = 2\pi f$.

### 1. 1st Order RC Low-pass
- **Transfer Function:** 
  $$H(j\omega) = \frac{1}{1 + j\omega R C}$$
- **Magnitude Response (Linear):** 
  $$|H(j\omega)| = \frac{1}{\sqrt{1 + (\omega R C)^2}}$$
- **Phase Response:** 
  $$\phi(j\omega) = -\arctan(\omega R C)$$
- **Cutoff Frequency ($-3\text{dB}$):** 
  $$f_c = \frac{1}{2\pi R C}$$

### 2. 1st Order RC High-pass
- **Transfer Function:** 
  $$H(j\omega) = \frac{j\omega R C}{1 + j\omega R C}$$
- **Magnitude Response (Linear):** 
  $$|H(j\omega)| = \frac{\omega R C}{\sqrt{1 + (\omega R C)^2}}$$
- **Phase Response:** 
  $$\phi(j\omega) = \frac{\pi}{2} - \arctan(\omega R C)$$

### 3. 2nd Order RC 2-Stage Low-pass
This is the currently connected second-order solver topology. It is a loaded cascade:
`Vin -> R1 -> node A`, `C1` from node A to ground, `R2` from node A to `Vout`, and `C2` from `Vout` to ground.

- **Transfer Function:**
  $$H(j\omega) = \frac{1}{(1 - \omega^2 R_1 C_1 R_2 C_2) + j\omega(R_1 C_1 + R_1 C_2 + R_2 C_2)}$$
- **Magnitude Response (Linear):** 
  $$|H(j\omega)| = \frac{1}{\sqrt{(1 - \omega^2 R_1 C_1 R_2 C_2)^2 + \omega^2(R_1 C_1 + R_1 C_2 + R_2 C_2)^2}}$$
- **Phase Response:** 
  $$\phi(j\omega) = \arctan2\Big(-\omega(R_1 C_1 + R_1 C_2 + R_2 C_2), 1 - \omega^2 R_1 C_1 R_2 C_2\Big)$$
- **Cutoff Frequency:**
  The application solves the `-3 dB` point numerically from:
  $$|H(j2\pi f_c)| = \frac{1}{\sqrt{2}}$$
  For equal component values, this gives:
  $$f_c = \frac{0.3742391543}{2\pi RC}$$
  The value $\frac{1}{2\pi\sqrt{R_1C_1R_2C_2}}$ is the undamped natural-frequency scale, not the displayed cutoff.

---

## Nonlinear Time-Domain Simulation

When utilizing Class II MLCC capacitors (e.g. X7R, Y5V), the capacitance drops as the DC bias voltage increases (voltage derating).

### 1. Charge-Conserving Capacitor Model
A simple voltage-dependent capacitance $C(V)$ leads to simulation errors if charge conservation isn't respected. 
The relationship is defined as:
$$Q(V) = \int_0^V C(v) dv$$
By tracking the **Charge ($Q$)** as the state variable rather than Voltage ($V$), the integrator maintains strict physical conservation.

The capacitance-voltage curve is modeled with a polynomial approximation:
$$C(V) = C_{nom} \times (1 + \alpha V + \beta V^2 + \gamma V^3)$$
Thus, charge is:
$$Q(V) = C_{nom} \times (V + \frac{\alpha}{2} V^2 + \frac{\beta}{3} V^3 + \frac{\gamma}{4} V^4)$$

In each time step, $V$ is found by numerically inverting $Q(V)$ using Newton-Raphson.

### 2. Numerical Integration (1st Order)
For a single RC filter, the current through the capacitor is:
$$I_c = \frac{V_{in}(t) - V_c}{R}$$
And by definition, $I_c = \frac{dQ}{dt}$.
The system uses the classical **Runge-Kutta 4th Order (RK4)** integration method to calculate the next state $Q(t+\Delta t)$.

### 3. Numerical Integration (2nd Order 2-Stage RC)
For the 2-stage filter, we track two independent state variables, $Q_1$ and $Q_2$:
- **Node A (intermediate):** 
  $$I_{C1} = \frac{V_{in}(t) - V_A}{R_1} - \frac{V_A - V_{out}}{R_2}$$
- **Node B (output):** 
  $$I_{C2} = \frac{V_A - V_{out}}{R_2}$$

This is simulated via a 2-Dimensional RK4 implementation, computing $dQ_1/dt$ and $dQ_2/dt$ at each Runge-Kutta sub-step.
When a separate C2 model is not provided, the solver uses the same voltage-dependence coefficients as C1 with the C2 nominal capacitance selected in the filter parameters.

### 4. Distortion Metrics (FFT)
- The time-domain output is multiplied by a **Blackman-Harris** window function and passed into a discrete Fast Fourier Transform (FFT).
- **Harmonics ($H_2$ to $H_5$)** are extracted by locating the FFT bin closest to multiples of the fundamental frequency.
- **THD (Total Harmonic Distortion)** is computed using the Root-Sum-Square method relative to the fundamental:
  $$THD_{\%} = \frac{\sqrt{V_{H2}^2 + V_{H3}^2 + V_{H4}^2 + V_{H5}^2}}{V_{Fundamental}} \times 100$$

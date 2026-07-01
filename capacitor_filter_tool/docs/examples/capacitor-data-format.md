# Capacitor Data Format

The tool should support measured or vendor-derived capacitance data as CSV.

## Minimal CSV

```csv
Voltage,Capacitance
-5,6.2e-6
-2.5,8.1e-6
0,10e-6
2.5,8.0e-6
5,6.0e-6
```

Rules:

- `Voltage` is in volts.
- `Capacitance` is in farads.
- Rows should be sorted by voltage if possible.
- The importer may sort rows defensively.
- Interpolation should be documented in the UI.

## Extended CSV

Optional columns can be added later:

```csv
Voltage,Capacitance,ESR,Temperature,PartNumber,Dielectric
0,10e-6,0.012,25,Example-10uF-X7R,X7R
5,6.0e-6,0.014,25,Example-10uF-X7R,X7R
```

The MVP should ignore unknown columns rather than fail.

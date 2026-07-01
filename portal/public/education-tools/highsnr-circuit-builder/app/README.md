# HighSNR Circuit Builder

**HighSNR Circuit Builder** is a powerful, web-based visual editor specifically designed to generate Python code for [Manim](https://github.com/ManimCommunity/manim). It eliminates the need for manual coordinate calculations when animating technical electronic circuits by allowing you to draw them visually right in your browser.

## Features

- **Drag and Drop Interface:** Visually lay out resistors, capacitors, inductors, transistors, diodes, switches, and standard junctions.
- **Strict ANSI/IEEE Compliance:** All passive components are automatically drawn and proportionally scaled according to strict engineering standards.
- **Layering System:** Route wires and draw custom SVG primitives (rectangles, circles, ellipses) on "Under" or "Over" layers to control what appears behind or in front of the active circuit.
- **Auto-Save & Project Files:** Never lose your work. The editor saves your progress automatically in your browser and lets you export/import `.json` project files.
- **Manim Code Generation:** Click one button to instantly copy the `VGroup` definitions for your entire circuit, ready to be pasted into your Manim `Scene`.

## Getting Started

Since this is a client-side only web tool, there's no complex setup or backend required. 

1. Simply open the `index.html` file in any modern web browser.
2. Start drawing!
3. Click **Export to Manim** to get your Python code.

## Integration

The tool generates code that depends on the `circuit_lib.py` library. Ensure `circuit_lib.py` is located in the same directory as your Manim scene scripts to seamlessly render the outputs.

## Hosting via GitHub Pages
To make this editor available online for free:
1. Go to **Settings** of this repository on GitHub.
2. Navigate to the **Pages** section on the left menu.
3. Select the `main` branch and `/ (root)` folder.
4. Save. Your editor will be live at `https://[your-username].github.io/[repository-name]`.

---

*Developed by the [HighSNR YouTube Channel](https://www.youtube.com/@High_SNR_Channel) team.*

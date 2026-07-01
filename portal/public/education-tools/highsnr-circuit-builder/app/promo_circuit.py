from manim import *
from circuit_lib import Resistor, Capacitor, Ground, NMOS, Switch, Diode, Inductor, Wire, WireCorner, Junction, Source, SignalGND, OpAmp

class PromoCircuit(Scene):
    def construct(self):
        # Remove background_color = WHITE to allow transparent background
        
        components = VGroup()
        wires = VGroup()
        shapes_under = VGroup()
        shapes_over = VGroup()
        labels = VGroup()

        signalgnd_0 = SignalGND(color=BLACK)
        signalgnd_0.move_to(RIGHT * -2.30 + UP * -0.10, aligned_edge=UP)
        components.add(signalgnd_0)
        
        source_1 = Source(color=BLACK)
        source_1.rotate(-90 * DEGREES)
        source_1.move_to(RIGHT * -2.30 + UP * 0.90)
        components.add(source_1)
        label_src = Text("5V", font_size=20, color=BLACK).next_to(source_1, LEFT, buff=0.2)
        labels.add(label_src)

        resistor_2 = Resistor(color=BLACK)
        resistor_2.rotate(-180 * DEGREES)
        resistor_2.move_to(RIGHT * 1.60 + UP * 2.00)
        components.add(resistor_2)
        label_r = Text("1 kΩ", font_size=20, color=BLACK).next_to(resistor_2, UP, buff=0.2)
        labels.add(label_r)

        capacitor_3 = Capacitor(color=BLACK)
        capacitor_3.rotate(-270 * DEGREES)
        capacitor_3.move_to(RIGHT * 2.60 + UP * 1.00)
        components.add(capacitor_3)
        label_c = Text("10 µF", font_size=20, color=BLACK).next_to(capacitor_3, RIGHT, buff=0.2)
        labels.add(label_c)

        signalgnd_4 = SignalGND(color=BLACK)
        signalgnd_4.move_to(RIGHT * 2.60 + UP * 0.00, aligned_edge=UP)
        components.add(signalgnd_4)
        
        switch_5 = Switch(color=BLACK)
        switch_5.move_to(RIGHT * -0.40 + UP * 2.00)
        components.add(switch_5)
        label_sw = Text("Switch", font_size=20, color=BLACK).next_to(switch_5, UP, buff=0.2)
        labels.add(label_sw)

        wire_6 = Wire([-1.40, 2.00, 0], [-2.30, 2.00, 0], color=BLACK)
        wires.add(wire_6)
        wire_7 = Wire([-2.30, 1.90, 0], [-2.30, 2.00, 0], color=BLACK)
        wires.add(wire_7)

        all_circuit = VGroup(shapes_under, wires, components, labels, shapes_over)
        
        # Center the circuit and scale it up a bit for the promo
        all_circuit.move_to(ORIGIN)
        all_circuit.scale(1.5)

        if len(shapes_under) > 0: self.play(Create(shapes_under), run_time=1)
        self.play(Create(wires), run_time=1.5)
        self.play(Create(components), run_time=2)
        
        # Fade in labels beautifully
        self.play(FadeIn(labels, shift=UP*0.2), run_time=1)
        
        if len(shapes_over) > 0: self.play(Create(shapes_over), run_time=1)
        
        self.wait(1)

        # switch_5 is added to components, and switch_5.submobjects[2] is the blade
        blade = switch_5.submobjects[2]
        
        # The vector of the blade is [0.48, 0.36, 0]. The angle is arctan(0.36/0.48) = arctan(0.75)
        # We rotate by -arctan(0.75) to make it horizontal (closed)
        angle_to_close = -np.arctan(0.75)

        # Animation: Замыкание (Closing the switch)
        self.play(Rotate(blade, angle=angle_to_close, about_point=blade.get_start()), run_time=0.5)
        
        self.wait(1.5)
        
        # Animation: Размыкание (Opening the switch)
        self.play(Rotate(blade, angle=-angle_to_close, about_point=blade.get_start()), run_time=0.5)
        
        self.wait(2)

from manim import *

class Resistor(VGroup):
    """Резистор (стандартная зигзагообразная линия)"""
    def __init__(self, color=WHITE, **kwargs):
        super().__init__(**kwargs)
        path = VMobject(color=color)
        p = [
            [-1.0, 0, 0], [-0.35, 0, 0],
            [-0.25, 0.16, 0], [-0.15, -0.16, 0],
            [-0.05, 0.16, 0], [0.05, -0.16, 0],
            [0.15, 0.16, 0], [0.25, -0.16, 0],
            [0.35, 0, 0], [1.0, 0, 0]
        ]
        path.set_points_as_corners(p)
        self.add(path)
        
    def get_start(self): return self.get_left()
    def get_end(self): return self.get_right()

class Capacitor(VGroup):
    """Конденсатор (две параллельные обкладки)"""
    def __init__(self, color=WHITE, **kwargs):
        super().__init__(**kwargs)
        w1 = Line([-1.0, 0, 0], [-0.08, 0, 0], color=color)
        p1 = Line([-0.08, 0.3, 0], [-0.08, -0.3, 0], color=color)
        p2 = Line([0.08, 0.3, 0], [0.08, -0.3, 0], color=color)
        w2 = Line([0.08, 0, 0], [1.0, 0, 0], color=color)
        self.add(w1, p1, p2, w2)
        
    def get_start(self): return self.get_left()
    def get_end(self): return self.get_right()

class Ground(VGroup):
    """Символ заземления (GND)"""
    def __init__(self, scale_factor=1.0, color=WHITE, **kwargs):
        super().__init__(**kwargs)
        w1 = Line([0, 0, 0], [0, -0.3*scale_factor, 0], color=color)
        g1 = Line([-0.3*scale_factor, -0.3*scale_factor, 0], [0.3*scale_factor, -0.3*scale_factor, 0], color=color)
        g2 = Line([-0.2*scale_factor, -0.4*scale_factor, 0], [0.2*scale_factor, -0.4*scale_factor, 0], color=color)
        g3 = Line([-0.1*scale_factor, -0.5*scale_factor, 0], [0.1*scale_factor, -0.5*scale_factor, 0], color=color)
        self.add(w1, g1, g2, g3)
        
    def get_anchor(self): return self.get_top()

class NMOS(VGroup):
    """Символ NMOS транзистора"""
    def __init__(self, color=WHITE, **kwargs):
        super().__init__(**kwargs)
        self.g_wire = Line([-1.0, 0, 0], [-0.1, 0, 0], color=color)
        self.g_plate = Line([-0.1, 0.4, 0], [-0.1, -0.4, 0], color=color)
        self.ch_plate = Line([0.1, 0.4, 0], [0.1, -0.4, 0], stroke_width=6, color=color)
        self.s_wire1 = Line([0.1, -0.3, 0], [0.5, -0.3, 0], color=color)
        self.s_wire2 = Line([0.5, -0.3, 0], [0.5, -1.0, 0], color=color)
        self.d_wire1 = Line([0.1, 0.3, 0], [0.5, 0.3, 0], color=color)
        self.d_wire2 = Line([0.5, 0.3, 0], [0.5, 1.0, 0], color=color)
        
        # Невидимая точка для центровки bounding box в (0,0)
        dummy = Dot([1.0, 0, 0], fill_opacity=0, radius=0)
        self.add(self.g_wire, self.g_plate, self.ch_plate, self.s_wire1, self.s_wire2, self.d_wire1, self.d_wire2, dummy)
        
    # Точки привязки для 100% точного соединения
    def get_gate(self): return self.g_wire.get_start()
    def get_drain(self): return self.d_wire2.get_end()
    def get_source(self): return self.s_wire2.get_end()

class Switch(VGroup):
    """Ключ (выключатель)"""
    def __init__(self, color=WHITE, **kwargs):
        super().__init__(**kwargs)
        w1 = Line([-1.0, 0, 0], [-0.3, 0, 0], color=color)
        c1 = Circle(radius=0.04, color=color).move_to([-0.26, 0, 0])
        blade = Line([-0.26, 0.04, 0], [0.22, 0.4, 0], color=color)
        c2 = Circle(radius=0.04, color=color).move_to([0.26, 0, 0])
        w2 = Line([0.3, 0, 0], [1.0, 0, 0], color=color)
        dummy = Dot([0, -0.4, 0], fill_opacity=0, radius=0)
        self.add(w1, c1, blade, c2, w2, dummy)

class Diode(VGroup):
    """Диод"""
    def __init__(self, color=WHITE, **kwargs):
        super().__init__(**kwargs)
        w1 = Line([-1.0, 0, 0], [-0.25, 0, 0], color=color)
        w_mid = Line([-0.25, 0, 0], [0.25, 0, 0], color=color)
        tri = Polygon([-0.25, 0.25, 0], [-0.25, -0.25, 0], [0.25, 0, 0], color=color, fill_opacity=0)
        bar = Line([0.25, 0.25, 0], [0.25, -0.25, 0], color=color)
        w2 = Line([0.25, 0, 0], [1.0, 0, 0], color=color)
        self.add(w1, w_mid, tri, bar, w2)

class Inductor(VGroup):
    """Индуктивность (катушка)"""
    def __init__(self, color=WHITE, **kwargs):
        super().__init__(**kwargs)
        w1 = Line([-1.0, 0, 0], [-0.6, 0, 0], color=color)
        c1 = ArcBetweenPoints([-0.6, 0, 0], [-0.2, 0, 0], angle=-PI, color=color)
        c2 = ArcBetweenPoints([-0.2, 0, 0], [0.2, 0, 0], angle=-PI, color=color)
        c3 = ArcBetweenPoints([0.2, 0, 0], [0.6, 0, 0], angle=-PI, color=color)
        w2 = Line([0.6, 0, 0], [1.0, 0, 0], color=color)
        dummy = Dot([0, -0.2, 0], fill_opacity=0, radius=0)
        self.add(w1, c1, c2, c3, w2, dummy)

class Wire(Line):
    """Идеальное соединение между двумя точками (просто линия без отступов)"""
    def __init__(self, start_pt, end_pt, color=WHITE, stroke_width=4, **kwargs):
        super().__init__(start_pt, end_pt, color=color, stroke_width=stroke_width, buff=0, **kwargs)

class WireCorner(VGroup):
    """Провод с изгибом под прямым углом"""
    def __init__(self, start_pt, end_pt, vertical_first=True, color=WHITE, stroke_width=4, **kwargs):
        super().__init__(**kwargs)
        corner_pt = [start_pt[0], end_pt[1], 0] if vertical_first else [end_pt[0], start_pt[1], 0]
        self.add(Wire(start_pt, corner_pt, color=color, stroke_width=stroke_width))
        self.add(Wire(corner_pt, end_pt, color=color, stroke_width=stroke_width))

class Junction(Dot):
    """Узел соединения (Node)"""
    def __init__(self, point=ORIGIN, color=WHITE, **kwargs):
        super().__init__(point=point, radius=0.1, color=color, **kwargs)

class Source(VGroup):
    """Источник сигнала (пустой круг с двумя выводами)"""
    def __init__(self, color=WHITE, **kwargs):
        super().__init__(**kwargs)
        w1 = Line([-1.0, 0, 0], [-0.4, 0, 0], color=color)
        circle = Circle(radius=0.4, color=color)
        w2 = Line([0.4, 0, 0], [1.0, 0, 0], color=color)
        self.add(w1, circle, w2)

class SignalGND(VGroup):
    """Сигнальная земля (треугольник)"""
    def __init__(self, scale_factor=1.0, color=WHITE, **kwargs):
        super().__init__(**kwargs)
        w1 = Line([0, 0, 0], [0, -0.3*scale_factor, 0], color=color)
        tri = Polygon(
            [-0.25*scale_factor, -0.3*scale_factor, 0],
            [0.25*scale_factor, -0.3*scale_factor, 0],
            [0, -0.6*scale_factor, 0],
            color=color, fill_opacity=0
        )
        self.add(w1, tri)
        
    def get_anchor(self): return self.get_top()




class OpAmp(VGroup):
    """Операционный усилитель (треугольник с 3 выводами)"""
    def __init__(self, color=WHITE, **kwargs):
        super().__init__(**kwargs)
        # Треугольник
        tri = Polygon([-0.5, 0.6, 0], [-0.5, -0.6, 0], [0.5, 0, 0], color=color)
        # Входы
        in_p = Line([-1.0, 0.3, 0], [-0.5, 0.3, 0], color=color)
        in_m = Line([-1.0, -0.3, 0], [-0.5, -0.3, 0], color=color)
        # Выход
        out = Line([0.5, 0, 0], [1.0, 0, 0], color=color)
        # Метки + и -
        plus = Text("+", font_size=16, color=color).move_to([-0.35, 0.3, 0])
        minus = Text("-", font_size=16, color=color).move_to([-0.35, -0.3, 0])
        self.add(tri, in_p, in_m, out, plus, minus)


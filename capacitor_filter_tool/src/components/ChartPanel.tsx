import { useEffect, useRef } from "react";
import {
  BarChart,
  type BarSeriesOption,
  LineChart,
  type LineSeriesOption,
  ScatterChart,
  type ScatterSeriesOption,
} from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TitleComponent,
  TooltipComponent,
  type GridComponentOption,
  type LegendComponentOption,
  type TitleComponentOption,
  type TooltipComponentOption,
} from "echarts/components";
import { init, use, type ComposeOption, type ECharts } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";

use([
  BarChart,
  LineChart,
  ScatterChart,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TitleComponent,
  TooltipComponent,
  CanvasRenderer,
]);

type FilterChartOption = ComposeOption<
  | GridComponentOption
  | LegendComponentOption
  | TitleComponentOption
  | TooltipComponentOption
  | LineSeriesOption
  | BarSeriesOption
  | ScatterSeriesOption
>;

type ChartPanelProps = {
  title: string;
  chartTitle?: string;
  xLabel: string;
  yLabel: string;
  seriesName?: string;
  data?: Array<[number, number]>;
  series?: ChartSeries[];
  cutoffFrequency?: number;
  markerLabel?: string;
  xScale?: "log" | "value";
  yScale?: "log" | "value";
  rightYLabel?: string;
  rightYScale?: "log" | "value";
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  rightYMin?: number;
  rightYMax?: number;
  fullWidth?: boolean;
  seriesType?: "line" | "bar" | "scatter";
  legendPosition?: "top" | "bottom";
  yFormatter: (value: number) => string;
  rightYFormatter?: (value: number) => string;
};

type ChartSeries = {
  name: string;
  data: Array<[number, number]>;
  color?: string;
  type?: "line" | "bar" | "scatter";
  showSymbol?: boolean;
  symbol?: string;
  symbolSize?: number;
  lineWidth?: number;
  areaColor?: string;
  areaOpacity?: number;
  yAxisIndex?: 0 | 1;
};

export function ChartPanel({
  title,
  chartTitle,
  xLabel,
  yLabel,
  seriesName = title,
  data,
  series,
  cutoffFrequency,
  markerLabel = "fc",
  xScale = "log",
  yScale = "value",
  rightYLabel,
  rightYScale = "value",
  xMin,
  xMax,
  yMin,
  yMax,
  rightYMin,
  rightYMax,
  fullWidth = false,
  seriesType = "line",
  legendPosition = "top",
  yFormatter,
  rightYFormatter,
}: ChartPanelProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<ECharts | null>(null);

  useEffect(() => {
    if (!elementRef.current) {
      return;
    }

    chartRef.current = init(elementRef.current);
    const resizeObserver = new ResizeObserver(() => chartRef.current?.resize());
    resizeObserver.observe(elementRef.current);

    return () => {
      resizeObserver.disconnect();
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) {
      return;
    }

    const chartSeries =
      series ??
      (data
        ? [
            {
              name: seriesName,
              data,
            },
          ]
        : []);

    const hasLegend = chartSeries.length > 1;
    const hasBottomLegend = hasLegend && legendPosition === "bottom";
    const leftYAxis = {
      type: yScale,
      name: yLabel,
      min: Number.isFinite(yMin) ? yMin : undefined,
      max: Number.isFinite(yMax) ? yMax : undefined,
      nameGap: 42,
      nameLocation: "middle" as const,
      axisLabel: {
        formatter: (value: number) => yFormatter(value),
        color: "#77818b",
      },
      nameTextStyle: {
        color: "#505b66",
      },
      splitLine: {
        lineStyle: {
          color: "#e6eaee",
        },
      },
    };
    const rightYAxis = {
      type: rightYScale,
      name: rightYLabel,
      min: Number.isFinite(rightYMin) ? rightYMin : undefined,
      max: Number.isFinite(rightYMax) ? rightYMax : undefined,
      position: "right" as const,
      nameGap: 46,
      nameLocation: "middle" as const,
      axisLabel: {
        formatter: (value: number) => (rightYFormatter ?? yFormatter)(value),
        color: "#77818b",
      },
      nameTextStyle: {
        color: "#505b66",
      },
      splitLine: {
        show: false,
      },
    };

    const option: FilterChartOption = {
      backgroundColor: "transparent",
      color: chartSeries.map((item) => item.color ?? "#2468a9"),
      animationDuration: 180,
      title: chartTitle
        ? {
            text: chartTitle,
            left: "center",
            top: 2,
            textStyle: {
              color: "#20262d",
              fontSize: 13,
              fontWeight: 500,
            },
          }
        : undefined,
      grid: {
        top: chartTitle ? 46 : 24,
        right: rightYLabel ? 66 : 18,
        bottom: hasBottomLegend ? 72 : 48,
        left: 58,
      },
      legend:
        hasLegend
          ? {
              ...(hasBottomLegend
                ? {
                    bottom: 0,
                    left: "center",
                  }
                : {
                    top: 0,
                    right: 8,
                  }),
              textStyle: {
                color: "#505b66",
              },
            }
          : undefined,
      tooltip: {
        trigger: "axis",
        backgroundColor: "#ffffff",
        borderColor: "#d4d9df",
        textStyle: {
          color: "#20262d",
        },
        valueFormatter: (value) => {
          const numericValue = Array.isArray(value) ? Number(value[1]) : Number(value);
          return Number.isFinite(numericValue) ? yFormatter(numericValue) : "";
        },
      },
      xAxis: {
        type: xScale,
        name: xLabel,
        min: Number.isFinite(xMin) ? xMin : undefined,
        max: Number.isFinite(xMax) ? xMax : undefined,
        nameLocation: "middle",
        nameGap: 34,
        minorTick: {
          show: true,
        },
        minorSplitLine: {
          show: true,
          lineStyle: {
            color: "#eceff2",
          },
        },
        axisLine: {
          lineStyle: {
            color: "#a9b1ba",
          },
        },
        axisLabel: {
          color: "#77818b",
        },
        nameTextStyle: {
          color: "#505b66",
        },
      },
      yAxis: rightYLabel ? [leftYAxis, rightYAxis] : leftYAxis,
      series: chartSeries.map((item) => {
        const type = item.type ?? seriesType;

        return {
          name: item.name,
          type,
          yAxisIndex: item.yAxisIndex,
          showSymbol: item.showSymbol ?? false,
          symbol: item.symbol,
          symbolSize: item.symbolSize,
          smooth: false,
          data: item.data,
          barWidth: type === "bar" ? "48%" : undefined,
          lineStyle:
            type === "line"
              ? {
                  width: item.lineWidth ?? (chartSeries.length > 1 ? 1.8 : 2.3),
                }
              : undefined,
          areaStyle:
            type === "line" && item.areaOpacity
              ? {
                  color: item.areaColor ?? item.color,
                  opacity: item.areaOpacity,
                }
              : undefined,
          markLine:
            Number.isFinite(cutoffFrequency) && item === chartSeries[0]
              ? {
                  symbol: "none",
                  label: {
                    formatter: markerLabel,
                    color: "#77818b",
                  },
                  lineStyle: {
                    color: "#9d4f70",
                    type: "dashed",
                  },
                  data: [
                    {
                      xAxis: cutoffFrequency,
                    },
                  ],
                }
              : undefined,
        };
      }),
    };

    chart.setOption(option, true);
  }, [
    cutoffFrequency,
    chartTitle,
    data,
    legendPosition,
    markerLabel,
    series,
    seriesName,
    seriesType,
    xMax,
    xLabel,
    xMin,
    xScale,
    yMax,
    yFormatter,
    yLabel,
    yMin,
    yScale,
  ]);

  return (
    <article className={fullWidth ? "graph-card full-width" : "graph-card"}>
      <div className="graph-title">
        <span>{title}</span>
      </div>
      <div className="graph-container">
        <div ref={elementRef} className="chart-canvas" />
      </div>
    </article>
  );
}

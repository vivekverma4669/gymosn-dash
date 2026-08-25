import React, { useState } from 'react';
import { niceMax, formatCompact, thinLabels } from './chartUtils';

export interface LineChartPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: LineChartPoint[];
  color?: string;
  height?: number;
  valueFormatter?: (value: number) => string;
  maxXLabels?: number;
}

const PADDING = { top: 16, right: 12, bottom: 24, left: 40 };
const WIDTH = 600;

export const LineChart: React.FC<LineChartProps> = ({
  data,
  color = 'var(--chart-1)',
  height = 200,
  valueFormatter = formatCompact,
  maxXLabels = 8,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = height - PADDING.top - PADDING.bottom;

  const max = niceMax(Math.max(...data.map((d) => d.value), 1));
  const stepX = data.length > 1 ? plotWidth / (data.length - 1) : 0;

  const xAt = (i: number) => PADDING.left + i * stepX;
  const yAt = (v: number) => PADDING.top + plotHeight - (v / max) * plotHeight;

  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i)} ${yAt(d.value)}`).join(' ');
  const areaPath = `${linePath} L ${xAt(data.length - 1)} ${PADDING.top + plotHeight} L ${xAt(0)} ${
    PADDING.top + plotHeight
  } Z`;

  const gridLines = [0, 0.25, 0.5, 0.75, 1];
  const xLabels = thinLabels(data, maxXLabels);
  const hovered = hoverIndex !== null ? data[hoverIndex] : null;

  const handleMove = (e: React.MouseEvent<SVGRectElement>) => {
    const svg = e.currentTarget.ownerSVGElement;
    if (!svg || data.length === 0) return;
    const rect = svg.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * WIDTH;
    const relative = (svgX - PADDING.left) / (stepX || 1);
    const idx = Math.max(0, Math.min(data.length - 1, Math.round(relative)));
    setHoverIndex(idx);
  };

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${WIDTH} ${height}`}
        width="100%"
        height={height}
        className="overflow-visible"
        preserveAspectRatio="none"
      >
        {gridLines.map((g) => (
          <line
            key={g}
            x1={PADDING.left}
            x2={WIDTH - PADDING.right}
            y1={PADDING.top + plotHeight * (1 - g)}
            y2={PADDING.top + plotHeight * (1 - g)}
            stroke="var(--chart-grid)"
            strokeWidth={1}
          />
        ))}

        {gridLines.map((g) => (
          <text
            key={g}
            x={PADDING.left - 8}
            y={PADDING.top + plotHeight * (1 - g) + 3}
            textAnchor="end"
            fontSize={9}
            fill="var(--chart-axis)"
          >
            {valueFormatter(max * g)}
          </text>
        ))}

        <path d={areaPath} fill={color} opacity={0.1} stroke="none" />
        <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {data.length > 0 && (
          <circle
            cx={xAt(data.length - 1)}
            cy={yAt(data[data.length - 1].value)}
            r={4}
            fill={color}
            stroke="hsl(var(--card))"
            strokeWidth={2}
          />
        )}

        {hovered && hoverIndex !== null && (
          <>
            <line
              x1={xAt(hoverIndex)}
              x2={xAt(hoverIndex)}
              y1={PADDING.top}
              y2={PADDING.top + plotHeight}
              stroke="var(--chart-axis)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <circle cx={xAt(hoverIndex)} cy={yAt(hovered.value)} r={4} fill={color} />
          </>
        )}

        {xLabels.map((d, i) =>
          d ? (
            <text key={i} x={xAt(i)} y={height - 6} textAnchor="middle" fontSize={9} fill="var(--chart-axis)">
              {d.label}
            </text>
          ) : null
        )}

        <rect
          x={PADDING.left}
          y={PADDING.top}
          width={plotWidth}
          height={plotHeight}
          fill="transparent"
          onMouseMove={handleMove}
          onMouseLeave={() => setHoverIndex(null)}
        />
      </svg>

      {hovered && hoverIndex !== null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-popover px-2.5 py-1.5 text-xs shadow-lg"
          style={{
            left: `${(xAt(hoverIndex) / WIDTH) * 100}%`,
            top: `${(yAt(hovered.value) / height) * 100 - 4}%`,
          }}
        >
          <p className="font-semibold text-foreground">{valueFormatter(hovered.value)}</p>
          <p className="text-[10px] text-muted-foreground">{hovered.label}</p>
        </div>
      )}
    </div>
  );
};

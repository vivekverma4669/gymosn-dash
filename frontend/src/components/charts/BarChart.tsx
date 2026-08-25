import React, { useState } from 'react';
import { niceMax, formatCompact, thinLabels } from './chartUtils';

export interface BarSeriesDef {
  key: string;
  label: string;
  color: string;
}

export interface BarChartDatum {
  label: string;
  values: Record<string, number>;
}

interface BarChartProps {
  data: BarChartDatum[];
  series: BarSeriesDef[];
  height?: number;
  valueFormatter?: (value: number) => string;
  maxXLabels?: number;
}

const PADDING = { top: 16, right: 12, bottom: 24, left: 40 };
const WIDTH = 600;
const MAX_BAR_WIDTH = 22;
const BAR_GAP = 2;

const roundedTopPath = (x: number, y: number, width: number, height: number, radius: number): string => {
  if (height <= 0) return '';
  const r = Math.min(radius, width / 2, height);
  return `M ${x} ${y + height}
    L ${x} ${y + r}
    Q ${x} ${y} ${x + r} ${y}
    L ${x + width - r} ${y}
    Q ${x + width} ${y} ${x + width} ${y + r}
    L ${x + width} ${y + height}
    Z`;
};

export const BarChart: React.FC<BarChartProps> = ({
  data,
  series,
  height = 200,
  valueFormatter = formatCompact,
  maxXLabels = 8,
}) => {
  const [hover, setHover] = useState<{ groupIndex: number; seriesIndex: number } | null>(null);

  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = height - PADDING.top - PADDING.bottom;

  const max = niceMax(Math.max(...data.flatMap((d) => series.map((s) => d.values[s.key] ?? 0)), 1));
  const groupWidth = data.length > 0 ? plotWidth / data.length : 0;
  const barWidth = Math.min(MAX_BAR_WIDTH, (groupWidth - BAR_GAP * (series.length + 1)) / series.length);
  const groupInnerWidth = barWidth * series.length + BAR_GAP * (series.length - 1);

  const gridLines = [0, 0.25, 0.5, 0.75, 1];
  const xLabels = thinLabels(data, maxXLabels);

  const hoveredDatum = hover ? data[hover.groupIndex] : null;

  return (
    <div className="relative">
      {series.length > 1 && (
        <div className="mb-2 flex items-center gap-4">
          {series.map((s) => (
            <div key={s.key} className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
              {s.label}
            </div>
          ))}
        </div>
      )}

      <svg viewBox={`0 0 ${WIDTH} ${height}`} width="100%" height={height} preserveAspectRatio="none">
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

        {data.map((d, groupIndex) => {
          const groupStart = PADDING.left + groupIndex * groupWidth + (groupWidth - groupInnerWidth) / 2;
          return (
            <g key={groupIndex}>
              {series.map((s, seriesIndex) => {
                const value = d.values[s.key] ?? 0;
                const barHeight = (value / max) * plotHeight;
                const x = groupStart + seriesIndex * (barWidth + BAR_GAP);
                const y = PADDING.top + plotHeight - barHeight;
                const isHovered = hover?.groupIndex === groupIndex && hover?.seriesIndex === seriesIndex;
                return (
                  <path
                    key={s.key}
                    d={roundedTopPath(x, y, barWidth, barHeight, 4)}
                    fill={s.color}
                    opacity={hover && !isHovered ? 0.55 : 1}
                    onMouseEnter={() => setHover({ groupIndex, seriesIndex })}
                    onMouseLeave={() => setHover(null)}
                  />
                );
              })}
              <rect
                x={PADDING.left + groupIndex * groupWidth}
                y={PADDING.top}
                width={groupWidth}
                height={plotHeight}
                fill="transparent"
                onMouseEnter={() => setHover({ groupIndex, seriesIndex: 0 })}
                onMouseLeave={() => setHover(null)}
              />
            </g>
          );
        })}

        {xLabels.map((d, i) =>
          d ? (
            <text
              key={i}
              x={PADDING.left + i * groupWidth + groupWidth / 2}
              y={height - 6}
              textAnchor="middle"
              fontSize={9}
              fill="var(--chart-axis)"
            >
              {d.label}
            </text>
          ) : null
        )}
      </svg>

      {hover && hoveredDatum && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-popover px-2.5 py-1.5 text-xs shadow-lg"
          style={{
            left: `${((PADDING.left + hover.groupIndex * groupWidth + groupWidth / 2) / WIDTH) * 100}%`,
            top: `${(PADDING.top / height) * 100}%`,
          }}
        >
          <p className="text-[10px] text-muted-foreground">{hoveredDatum.label}</p>
          {series.map((s) => (
            <p key={s.key} className="flex items-center gap-1.5 font-semibold text-foreground">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
              {s.label}: {valueFormatter(hoveredDatum.values[s.key] ?? 0)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

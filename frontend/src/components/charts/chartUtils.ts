// Rounds a max value up to a clean axis ceiling (1/2/5 * 10^n), so gridlines land on tidy numbers.
export const niceMax = (max: number): number => {
  if (max <= 0) return 10;
  const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
  const normalized = max / magnitude;
  let niceNormalized: number;
  if (normalized <= 1) niceNormalized = 1;
  else if (normalized <= 2) niceNormalized = 2;
  else if (normalized <= 5) niceNormalized = 5;
  else niceNormalized = 10;
  return niceNormalized * magnitude;
};

export const formatCompact = (value: number): string => {
  if (Math.abs(value) >= 1_00_00_000) return `${(value / 1_00_00_000).toFixed(1)}Cr`;
  if (Math.abs(value) >= 1_00_000) return `${(value / 1_00_000).toFixed(1)}L`;
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(Math.round(value));
};

// Only show every Nth label so x-axis text never overlaps on dense series.
export const thinLabels = <T,>(items: T[], maxLabels: number): (T | null)[] => {
  if (items.length <= maxLabels) return items;
  const step = Math.ceil(items.length / maxLabels);
  return items.map((item, i) => (i % step === 0 || i === items.length - 1 ? item : null));
};

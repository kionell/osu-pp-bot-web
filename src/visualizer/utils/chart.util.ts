import { ScatterDataPoint, Tick } from 'chart.js';

/**
 * Converts milliseconds to timespan.
 * @param ms The ammount of milliseconds
 * @returns Time in format of h:m:ss with optional hours.
 */
export function msToTime(ms: number): string {
  ms = Math.round(ms / 1000);

  const seconds = Math.trunc(ms) % 60;
  const minutes = Math.trunc(ms / 60) % 60;
  const hours = Math.trunc(ms / 3600);

  const values = [
    minutes.toString(),
    seconds.toString().padStart(2, '0'),
  ];

  if (hours > 0) {
    values.unshift(hours.toString());
    values[1] = values[1].padStart(2, '0');
  }

  return values.join(':');
}

/**
 * Reduces ammount of strains that will be drawn on the chart.
 * @param strains Strains to be decimated.
 * @param maxChunks Max possible points on the chart.
 * @returns Decimated strains.
 */
export function decimateStrains(strains: number[], maxChunks = 200): ScatterDataPoint[] {
  /**
   * Single strain step is 400 ms by default.
   */
  const STRAIN_STEP = 400;

  const chunkSize = Math.ceil(strains.length / maxChunks);

  const decimated = [];

  for (let i = 0; i < strains.length; i += chunkSize) {
    const peaks = strains.slice(i, i + chunkSize);

    decimated.push({ x: i * STRAIN_STEP, y: Math.max(...peaks) });
  }

  return decimated;
}

/**
 * Reduces ammount of ticks that will be drawn on the chart.
 * @param ticks Ticks to be decimated.
 * @param maxTicks Max possible ticks on the chart.
 * @returns Decimated ticks.
 */
export function decimateTicks(ticks: Tick[], maxTicks = 5): Tick[] {
  if (ticks.length <= maxTicks) {
    return ticks;
  }

  // This number is used to display a tick every N ticks.
  const density = Math.trunc(ticks.length / maxTicks);

  if (isNaN(density)) return ticks;

  return ticks.filter((tick, index) => {
    const firstOrLast = index === 0 || index === ticks.length - 1;
    const closeToEnd = (ticks.length - index) / density < 0.1;

    // Always hide first or last ticks and ticks that are close to end.
    if (firstOrLast || closeToEnd) return;

    if (index % density === 0) return tick;
  });
}

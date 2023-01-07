import { Tick } from 'chart.js';

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

export function formatNumber(value: number): string {
  const error = 0.000001;

  if (value >= 1e9 - error) {
    return value.toExponential(1);
  }

  if (value >= 1e6 - error) {
    return `${(value / 1e6).toFixed(1)}m`;
  }

  if (value >= 1e4 - error) {
    return `${(value / 1e3).toFixed(1)}k`;
  }

  return value.toFixed(0);
}

/**
 * Reduces ammount of ticks that will be drawn on the chart.
 * @param ticks Ticks to be decimated.
 * @param maxTicks Max possible ticks on the chart.
 * @param hideFirstLast Should first and last ticks be hidden?
 * @returns Decimated ticks.
 */
export function decimateTicks(ticks: Tick[], maxTicks = 5, hideFirstLast = true): Tick[] {
  // This number is used to display a tick every N ticks.
  const density = Math.ceil(ticks.length / maxTicks);

  if (isNaN(density)) return ticks;

  return ticks.filter((tick, index) => {
    const firstTick = index === 0;

    // Hide first tick if required
    if (firstTick && hideFirstLast) return;

    const lastTick = index === ticks.length - 1;

    // Hide last tick if required and if there are more than 2 ticks.
    if (lastTick && ticks.length > 2 && hideFirstLast) return;

    const closeToStart = index / density < 0.1 && !firstTick;
    const closeToEnd = (ticks.length - index) / density < 0.1 && !lastTick;

    // Always hide ticks that are close to the start or end.
    if (closeToStart || closeToEnd) return;

    if (index % density === 0) return tick;
  });
}

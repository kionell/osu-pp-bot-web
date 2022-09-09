import { ChartDataset } from 'chart.js';

type LifeBarData = Pick<ChartDataset, 'label' | 'data'>;

export function getReplayChartDataset(lifeBar: LifeBarData): ChartDataset {
  return {
    ...lifeBar,
    type: 'line',
    borderJoinStyle: 'round',
    borderCapStyle: 'round',
    borderWidth: 1.5,
    pointRadius: 0,
    tension: 0.35,
    fill: 'origin',
  };
}

import { ChartDataset } from 'chart.js';

type SkillData = Pick<ChartDataset, 'label' | 'data'>;

export function getStrainChartDataset(skill: SkillData, colors: string[]): ChartDataset {
  return {
    ...skill,
    type: 'line',
    borderJoinStyle: 'round',
    borderCapStyle: 'round',
    borderWidth: 1.5,
    borderColor: colors[0],
    pointRadius: 0,
    tension: 0.35,
    fill: {
      target: 'origin',
      above: colors[1],
    },
  };
}

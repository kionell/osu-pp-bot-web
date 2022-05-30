import { ChartDataset } from 'chart.js';

type SkillData = Pick<ChartDataset, 'label' | 'data'>;

export function getStrainChartDataset(skill: SkillData, colors: string[]): ChartDataset {
  return {
    ...skill,
    borderColor: colors[0],
    borderWidth: 2,
    borderJoinStyle: 'round',
    borderCapStyle: 'round',
    pointRadius: 0,
    tension: 0.25,
    fill: {
      target: 'stack',
      above: colors[1],
    },
  };
}

import { ScatterDataPoint } from 'chart.js';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { Injectable } from '@nestjs/common';
import { GameMode, IBeatmapSkill } from '@kionell/osu-pp-calculator';
import { getStrainChartDataset } from './partials/chart-dataset.partial';
import { getStrainChartOptions } from './partials/chart-options.partial';
import { ColorUtils } from '../utils/color.util';
import { msToTime } from '../utils/chart.util';
import {
  getBackgroundImagePlugin,
  getDatasetBlendingPlugin,
} from '../utils/plugin.util';

@Injectable()
export class StrainChartService {
  static readonly GRAPH_WIDTH = 552;
  static readonly GRAPH_HEIGHT = 150;

  /**
   * Max possible points on the chart.
   */
  static readonly MAX_CHUNKS = 200;

  /**
   * Single strain step is 400 ms by default.
   */
  static readonly STRAIN_STEP = 400;

  private static chart = new ChartJSNodeCanvas({
    width: StrainChartService.GRAPH_WIDTH,
    height: StrainChartService.GRAPH_HEIGHT,
  });

  constructor(private colorUtils: ColorUtils) {}

  /**
   * Generates a new PNG image of beatmap strains.
   * @param skills Data for generating strain chart.
   * @param backgroundURL Background URL of this strain chart.
   * @param rulesetId Ruleset of this strain chart.
   * @returns Buffer with image data.
   */
  async generateImage(skills: IBeatmapSkill[], backgroundURL: string | null, rulesetId?: GameMode): Promise<Buffer> {
    const maxPoints = skills.reduce((max, skill) => {
      return Math.max(max, skill.strainPeaks.length);
    }, 0);

    const decimated = skills.map((skill) => {
      return {
        label: skill.title,
        data: this.decimateStrains(skill.strainPeaks),
      };
    });

    const colors = this.colorUtils.getColorsForRuleset(rulesetId);

    /**
     * Rewrite second aim skill to only show slider aim if it's osu!standard ruleset.
     */
    if (rulesetId === GameMode.Osu && skills[1]?.title.startsWith('Aim')) {
      const totalStrains = decimated[0].data;
      const sliderStrains = decimated[1].data;

      decimated[1].label = 'Aim (Sliders)';

      for (let i = 0; i < sliderStrains.length; i++) {
        sliderStrains[i].y = totalStrains[i].y - sliderStrains[i].y;
      }
    }

    const maxHeight = decimated.reduce((max, skill) => {
      for (const point of skill.data) {
        max = Math.max(max, point.y);
      }

      return Math.ceil(max);
    }, 0);

    const datasets = decimated.map((skill, i) => {
      return getStrainChartDataset(skill, colors[i]);
    });

    const labels = (datasets[0].data ?? []).map((d: any) => {
      return msToTime(d.x);
    });

    const options = getStrainChartOptions(
      StrainChartService.GRAPH_WIDTH,
      maxHeight,
      maxPoints,
      true,
    );

    return await StrainChartService.chart.renderToBuffer({
      type: 'line',
      data: {
        datasets,
        labels,
      },
      plugins: [
        await getBackgroundImagePlugin(
          StrainChartService.GRAPH_WIDTH,
          StrainChartService.GRAPH_HEIGHT,
          backgroundURL,
        ),
        await getDatasetBlendingPlugin(),
      ],
      options,
    });
  }

  /**
   * Reduces ammount of strains that will be drawn on the chart.
   * @param strains Strains to be decimated.
   * @returns Decimated strains.
   */
  decimateStrains(strains: number[]): ScatterDataPoint[] {
    const chunkSize = Math.ceil(strains.length / StrainChartService.MAX_CHUNKS);

    const decimated = [];

    for (let i = 0; i < strains.length; i += chunkSize) {
      const peaks = strains.slice(i, i + chunkSize);

      decimated.push({
        x: i * StrainChartService.STRAIN_STEP,
        y: Math.max(...peaks),
      });
    }

    return decimated;
  }
}

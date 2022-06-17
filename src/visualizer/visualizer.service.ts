import SparkMD5 from 'spark-md5';
import fs from 'fs';
import { Injectable } from '@nestjs/common';
import { GameMode } from '@kionell/osu-pp-calculator';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { ApiService } from '../api/api.service';
import { IBeatmapStrains } from './interfaces/beatmap-strains.interface';
import { getStrainChartDataset } from './partials/chart-dataset.partial';
import { getStrainChartOptions } from './partials/chart-options.partial';
import { getStrainChartPlugins } from './partials/chart-plugins.partial';
import { ColorUtils } from './utils/color.util';
import { decimateStrains, msToTime } from './utils/chart.util';

@Injectable()
export class VisualizerService {
  constructor(
    private apiService: ApiService,
    private colorUtils: ColorUtils,
  ) {}

  readonly STRAIN_GRAPH_WIDTH = 552;
  readonly STRAIN_GRAPH_HEIGHT = 150;

  private strainChart = new ChartJSNodeCanvas({
    width: this.STRAIN_GRAPH_WIDTH,
    height: this.STRAIN_GRAPH_HEIGHT,
  });

  /**
   * Generates a new PNG image of beatmap strains.
   * @param beatmapStrains Data for generating strain chart.
   * @returns Name of the generated file or null.
   */
  async generateStrainChart(beatmapStrains: IBeatmapStrains, rulesetId?: GameMode): Promise<string | null> {
    const { skills, beatmapsetId } = beatmapStrains;

    if (!skills) return null;

    const colors = this.colorUtils.getColorsForRuleset(rulesetId);

    /**
     * Remove second aim skill if it's osu!standard ruleset.
     */
    if (rulesetId === GameMode.Osu && skills[1]?.title.startsWith('Aim')) {
      const totalStrains = skills[0].strainPeaks;
      const sliderStrains = skills[1].strainPeaks;

      skills[1].title = 'Aim (Sliders)';

      for (let i = 0; i < sliderStrains.length; i++) {
        sliderStrains[i] = totalStrains[i] - sliderStrains[i];
      }
    }

    const maxPoints = skills.reduce((max, skill) => {
      return Math.max(max, skill.strainPeaks.length);
    }, 0);

    const decimated = skills.map((skill) => {
      return {
        label: skill.title,
        data: decimateStrains(skill.strainPeaks),
      };
    });

    const maxHeight = decimated.reduce((max, skill) => {
      for (const point of skill.data) {
        max = Math.max(max, point.y);
      }

      return Math.ceil(max);
    }, 0);

    const datasets = decimated.map((skill, i) => {
      return getStrainChartDataset(skill, colors[i]);
    });

    const labels = datasets[0].data.map((d: any) => {
      return msToTime(d.x);
    });

    const plugins = await getStrainChartPlugins(
      this.STRAIN_GRAPH_WIDTH,
      this.STRAIN_GRAPH_HEIGHT,
      this.getBackgroundURL(beatmapsetId),
    );

    const buffer = await this.strainChart.renderToBuffer({
      type: 'line',
      data: {
        datasets,
        labels,
      },
      options: getStrainChartOptions(this.STRAIN_GRAPH_WIDTH, maxHeight, maxPoints, true),
      plugins,
    });

    return new Promise((res) => {
      const dirPath = './public/strains';
      const fileName = `${SparkMD5.ArrayBuffer.hash(buffer)}.png`;
      const filePath = `${dirPath}/${fileName}`;

      fs.mkdir(dirPath, { recursive: true }, (err) => {
        if (err) return res(null);

        fs.writeFile(filePath, buffer, (err) => {
          res(err ? null : fileName);
        });
      });
    });
  }

  private getBackgroundURL(beatmapsetId?: number): string | null {
    if (!beatmapsetId || beatmapsetId <= 0) return null;

    const urlGenerator = this.apiService.createURLGenerator();

    return urlGenerator.generateBeatmapCoverURL(beatmapsetId);
  }
}

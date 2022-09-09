import { ILifeBarFrame } from 'osu-classes';
import { ScatterDataPoint } from 'chart.js';
import { Injectable } from '@nestjs/common';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { msToTime } from '../utils/chart.util';
import { getReplayChartDataset } from './partials/chart-dataset.partial';
import { getReplayChartOptions } from './partials/chart-options.partial';
import { ColorUtils } from '../utils/color.util';
import {
  getBackgroundImagePlugin,
  getDatasetBlendingPlugin,
  getVerticalGradientPlugin,
} from '../utils/plugin.util';

@Injectable()
export class ReplayChartService {
  static readonly GRAPH_WIDTH = 552;
  static readonly GRAPH_HEIGHT = 150;

  /**
   * Max possible points on the chart.
   */
  static readonly MAX_CHUNKS = 200;

  static readonly MIN_HEIGHT = 0;
  static readonly MAX_HEIGHT = 1;

  private static chart = new ChartJSNodeCanvas({
    width: ReplayChartService.GRAPH_WIDTH,
    height: ReplayChartService.GRAPH_HEIGHT,
  });

  constructor(private colorUtils: ColorUtils) {}

  /**
   * Generates a new PNG image of replay life bar.
   * @param lifeBar Data for generating replay chart.
   * @param backgroundURL Background URL of this strain chart.
   * @returns Buffer with image data.
   */
  async generateImage(lifeBar: ILifeBarFrame[], backgroundURL: string | null): Promise<Buffer> {
    const decimated = {
      label: 'HP Graph',
      data: this.decimateLifeBar(lifeBar),
    };

    const colors = this.colorUtils.getLifeBarColors();

    const dataset = getReplayChartDataset(decimated);

    const labels = dataset.data.map((d: any) => msToTime(d.x));

    const options = getReplayChartOptions(
      ReplayChartService.GRAPH_WIDTH,
      ReplayChartService.MAX_HEIGHT,
      dataset.data.length,
      true,
    );

    return await ReplayChartService.chart.renderToBuffer({
      type: 'line',
      data: {
        datasets: [dataset],
        labels,
      },
      plugins: [
        await getBackgroundImagePlugin(
          ReplayChartService.GRAPH_WIDTH,
          ReplayChartService.GRAPH_HEIGHT,
          backgroundURL,
        ),
        await getDatasetBlendingPlugin(),
        await getVerticalGradientPlugin(colors),
      ],
      options,
    });
  }

  /**
   * Reduces ammount of life bar frames that will be drawn on the chart.
   * @param lifeBar Life bar frames to be decimated.
   * @returns Decimated life bar frames.
   */
  decimateLifeBar(lifeBar: ILifeBarFrame[]): ScatterDataPoint[] {
    const chunkSize = Math.ceil(lifeBar.length / ReplayChartService.MAX_CHUNKS);

    const decimated = [];

    for (let i = 0; i < lifeBar.length; i += chunkSize) {
      const chunk = lifeBar.slice(i, i + chunkSize);

      decimated.push({
        x: chunk.reduce((p, c) => p + c.startTime, 0) / chunk.length,
        y: chunk.reduce((p, c) => p + c.health, 0) / chunk.length,
      });
    }

    return decimated;
  }
}

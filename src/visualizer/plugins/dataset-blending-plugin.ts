import { Chart } from 'chart.js';

/**
 * Chart.js plugin for blending colors of datasets.
 */
export class DatasetBlendingPlugin {
  /**
   * ID of the chart.js plugin.
   */
  id = 'dataset-blending-plugin';

  beforeDatasetsDraw(chart: Chart): void {
    chart.ctx.globalCompositeOperation = 'lighten';
  }

  afterDatasetsDraw(chart: Chart): void {
    chart.ctx.globalCompositeOperation = 'source-over';
  }
}

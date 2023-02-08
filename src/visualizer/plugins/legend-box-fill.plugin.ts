import { Chart } from 'chart.js';

/**
 * Chart.js plugin for filling legend color boxes.
 */
export class LegendBoxFillPlugin {
  /**
   * ID of the chart.js plugin.
   */
  id = 'legend-box-fill-plugin';

  beforeDraw(chart: Chart): void {
    chart.legend?.legendItems?.forEach((item) => {
      item.fillStyle = item.strokeStyle;
    });
  }
}

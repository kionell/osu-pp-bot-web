import { Chart } from 'chart.js';

/**
 * Chart.js plugin for drawing vertical gradients for datasets.
 */
export class VerticalGradientPlugin {
  /**
   * ID of the chart.js plugin.
   */
  id = 'vertical-gradient-plugin';

  private colors: string[][];

  declare originalBorderColor: string;
  declare originalFillColor: string;

  constructor(colors: string[][]) {
    this.colors = colors;
  }

  beforeDatasetsUpdate(chart: Chart): void {
    if (!this.colors || !this.colors.length) return;

    const borderGradient = chart.ctx.createLinearGradient(
      0, chart.chartArea.top,
      0, chart.chartArea.bottom,
    );

    const fillGradient = chart.ctx.createLinearGradient(
      0, chart.chartArea.top,
      0, chart.chartArea.bottom,
    );

    const gradientStep = 1 / (this.colors.length - 1);

    this.colors.forEach((color, i) => {
      borderGradient.addColorStop(i * gradientStep, color[0]);
      fillGradient.addColorStop(i * gradientStep, color[1]);
    });

    chart.data.datasets.forEach((dataset) => {
      dataset.borderColor = borderGradient;
      dataset.backgroundColor = fillGradient;
    });
  }
}

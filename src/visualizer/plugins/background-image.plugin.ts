import { Chart } from 'chart.js';
import { Image } from 'canvas';

/**
 * Chart.js plugin for loading background images.
 */
export class BackgroundImagePlugin {
  /**
   * ID of the chart.js plugin.
   */
  id = 'background-image-plugin';

  /**
   * Image that will be used to draw chart background.
   */
  private image: Image | null;

  constructor(image: Image | null) {
    this.image = image;
  }

  beforeDraw(chart: Chart): void {
    if (!this.image) return;

    chart.ctx.drawImage(this.image as any, 0, 0);
  }
}

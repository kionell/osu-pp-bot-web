import { ScatterDataPoint } from 'chart.js';

/**
 * Beatmap skill data in valid format for Chart.js
 */
export interface IDecimatedSkill {
  /**
   * Dataset label.
   */
  label: string;

  /**
   * Dataset values.
   */
  data: ScatterDataPoint[];
}

import SparkMD5 from 'spark-md5';
import Piscina from 'piscina';
import { Injectable, UseFilters } from '@nestjs/common';
import { resolve } from 'path';

import {
  IBeatmapCalculationOptions,
  ICalculatedBeatmap,
  IScoreCalculationOptions,
  ICalculatedScore,
} from '@kionell/osu-pp-calculator';

import { ProcessingMemoization } from './utils/processing-memoization';
import { AllExceptionsFilter } from '../exceptions/all-exeption.fitler';

type ICalculationOptions = IBeatmapCalculationOptions | IScoreCalculationOptions;
type ICalculationResult = ICalculatedBeatmap | ICalculatedScore;

@Injectable()
export class CalculatorService {
  private processed = new ProcessingMemoization();

  private pool: Piscina;

  constructor() {
    this.pool = new Piscina({
      filename: resolve(__dirname, './calculator.worker.js'),
    });
  }

  /**
   * Calculates difficulty & performance attributes for a specific beatmap.
   * @param options Beatmap calculation options.
   * @returns Beatmap information and calculated attributes.
   */
  @UseFilters(AllExceptionsFilter)
  async calculateBeatmap(options: IBeatmapCalculationOptions): Promise<ICalculatedBeatmap> {
    const promise = await this.calculate('calculateBeatmap', options);

    return promise as ICalculatedBeatmap;
  }

  /**
   * Calculates difficulty & performance attributes for a specific score.
   * @param options Score calculation options.
   * @returns Score information and calculated attributes.
   */
  @UseFilters(AllExceptionsFilter)
  async calculateScore(options: IScoreCalculationOptions): Promise<ICalculatedScore> {
    const promise = await this.calculate('calculateScore', options);

    return promise as ICalculatedScore;
  }

  /**
   * Simulates a new score by score options.
   * @param options Score calculation options.
   * @returns Score information and calculated attributes.
   */
  @UseFilters(AllExceptionsFilter)
  async simulateScore(options: IScoreCalculationOptions): Promise<ICalculatedScore> {
    const promise = await this.calculate('simulateScore', options);

    return promise as ICalculatedScore;
  }

  private async calculate(taskName: string, options: ICalculationOptions): Promise<ICalculationResult> {
    const taskId = this.generateTaskId(taskName, options);

    if (this.processed.has(taskId)) {
      return this.processed.get(taskId) as Promise<ICalculationResult>;
    }

    const task = async () => {
      const calculated = await this.pool.run(options, {
        name: taskName,
      });

      return JSON.parse(calculated);
    };

    const promise = task();

    this.processed.set(taskId, promise);

    return promise;
  }

  private generateTaskId(taskName: string, options: ICalculationOptions): string {
    return SparkMD5.hash(taskName + JSON.stringify(options));
  }
}

import {
  BeatmapCalculator,
  IBeatmapCalculationOptions,
  ScoreCalculator,
  IScoreCalculationOptions,
} from '@kionell/osu-pp-calculator';

/**
 * Beatmap difficulty & performance calculator.
 */
const beatmapCalculator = new BeatmapCalculator();

/**
 * Score difficulty & performance calculator.
 */
const scoreCalculator = new ScoreCalculator();

/**
 * Calculates difficulty & performance attributes for a specific beatmap.
 * @param options Beatmap calculation options.
 * @returns Beatmap information and calculated attributes.
 */
export async function calculateBeatmap(options: IBeatmapCalculationOptions): Promise<string> {
  return JSON.stringify(await beatmapCalculator.calculate(options));
}

/**
 * Calculates difficulty & performance attributes for a specific score.
 * @param options Score calculation options.
 * @returns Score information and calculated attributes.
 */
export async function calculateScore(options: IScoreCalculationOptions): Promise<string> {
  return JSON.stringify(await scoreCalculator.calculate(options));
}

/**
 * Simulates a new score by score options.
 * @param options Score calculation options.
 * @returns Score information and calculated attributes.
 */
export async function simulateScore(options: IScoreCalculationOptions): Promise<string> {
  return JSON.stringify(await scoreCalculator.calculate(options));
}

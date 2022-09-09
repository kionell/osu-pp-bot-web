import { IBeatmapSkill } from '@kionell/osu-pp-calculator';

/**
 * Beatmap strain data.
 */
export interface IBeatmapStrains {
  /**
   * Beatmapset ID.
   */
  beatmapsetId?: number;

  /**
   * Beatmap skills data.
   */
  skills: IBeatmapSkill[] | null;
}

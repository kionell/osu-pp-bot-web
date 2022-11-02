import { Server } from '@kionell/osu-api';

/**
 * Options to create a beatmap.
 */
export class BeatmapOptionsDto {
  /**
   * Beatmap ID.
   */
  beatmapId?: number;

  /**
   * Ruleset ID.
   */
  rulesetId?: number;

  /**
   * Mod combination or bitwise.
   */
  mods?: string | number;

  /**
   * Custom approach rate for the target beatmap.
   */
  approachRate?: number;

  /**
   * Prevents scaling of approach rate from difficulty adjusting mods.
   * @default false
   */
  lockApproachRate?: boolean;

  /**
   * Custom overall difficulty for the target beatmap.
   */
  overallDifficulty?: number;

  /**
   * Prevents scaling of overall difficulty from difficulty adjusting mods.
   * @default false
   */
  lockOverallDifficulty?: boolean;

  /**
   * Custom circle size for the target beatmap.
   */
  circleSize?: number;

  /**
   * Prevents scaling of circle size from difficulty adjusting mods.
   * @default false
   */
  lockCircleSize?: boolean;

  /**
   * Custom clock rate for the target beatmap.
   */
  clockRate?: number;

  /**
   * Custom BPM for the target beatmap.
   */
  bpm?: number;

  /**
   * Total hits for gradual beatmap difficulty calculation.
   * If it differs from the hit object count of 
   * a full beatmap then it will force difficulty calculation.
   */
  totalHits?: number;

  /**
   * Server name (bancho, gatari...).
   */
  server?: keyof typeof Server;

  /**
   * Search query.
   */
  search?: string;

  /**
   * Beatmap MD5 hash.
   */
  hash?: string;

  /**
   * Custom beatmap file URL.
   */
  fileURL?: string;

  /**
   * Custom replay file URL.
   */
  replayURL?: string;

  /**
   * Accuracy list for beatmap performance calculation.
   */
  accuracy?: number[];

  /**
   * Should beatmap be recalculated or not?
   */
  recalculate?: boolean;
}

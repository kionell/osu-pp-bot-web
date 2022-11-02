import { Server } from '@kionell/osu-api';

/**
 * Options to simulate a score.
 */
export class ScoreOptionsDto {
  /**
   * Beatmap ID.
   */
  beatmapId?: number;

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
   * Score ID.
   */
  scoreId?: number;

  /**
   * Server name (bancho, gatari...).
   */
  server?: keyof typeof Server;

  /**
   * Search query.
   */
  search?: string;

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
   * Target score misses.
   */
  countMiss?: number;

  /**
   * Target score 50's.
   */
  count50?: number;

  /**
   * Target score 100's.
   */
  count100?: number;

  /**
   * Target score 300's.
   */
  count300?: number;

  /**
   * Target score katu hits.
   */
  countKatu?: number;

  /**
   * Target score geki hits.
   */
  countGeki?: number;

  /**
   * Target score accuracy.
   */
  accuracy?: number;

  /**
   * Target max combo of a score.
   */
  maxCombo?: number;

  /**
   * Target percent of max combo of a score.
   */
  percentCombo?: number;

  /**
   * Should this score be fixed to FC?
   */
  fix?: boolean;

  /**
   * Draw life bar graph?
   */
  drawGraph?: boolean;
}

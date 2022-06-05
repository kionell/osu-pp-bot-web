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
   * Target score accuracy.
   */
  accuracy?: number;

  /**
   * Target total score.
   */
  totalScore?: number;

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
}

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
   * Total score list for osu!mania beatmap performance calculation.
   */
  totalScores?: number[];

  /**
   * Should beatmap be recalculated or not?
   */
  recalculate?: boolean;
}

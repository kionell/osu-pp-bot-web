import { ScoreRank } from 'osu-classes';
import { IHitStatistics } from './hit-statistics.interface';
import { IBeatmapResponse } from '../../beatmap/interfaces/beatmap-response.interface';
import { IPerformanceAttributes } from '../../performance/interfaces/performance-attributes.interface';

export interface IScoreResponse {
  /**
   * A score ID.
   */
  id: number;

  /**
   * A rank of the play.
   */
  rank: keyof typeof ScoreRank;

  /**
   * Total score of the play.
   */
  totalScore: number;

  /**
   * Total accuracy of the play.
   */
  accuracy: number;

  /**
   * Max combo of the play.
   */
  maxCombo: number;

  /**
   * Whether the map was passed or not.
   */
  passed: boolean;

  /**
   * Perfect combo or not?
   */
  perfect: boolean;

  /**
   * Ruleset ID of the play.
   */
  rulesetId: number;

  /**
   * Mods of the play.
   */
  mods: string;

  /**
   * Username of the player who set this play.
   */
  username: string;

  /**
   * User ID of the player who set this play.
   */
  userId: number;

  /**
   * The date when this play was set.
   */
  date: Date;

  /**
   * Score hit statistics.
   */
  statistics: IHitStatistics;

  /**
   * Total hits of a score.
   */
  totalHits: number;

  /**
   * Beatmap of this score.
   */
  beatmap: IBeatmapResponse;

  /**
   * Performance attributes of a score.
   */
  performance: IPerformanceAttributes;
}

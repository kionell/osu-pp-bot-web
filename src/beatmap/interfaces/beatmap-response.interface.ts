import { IBeatmapGeneral } from './beatmap-general.interface';
import { IBeatmapMetadata } from './beatmap-metadata.interface';
import { IDifficultyAttributes } from '../../difficulty/interfaces/difficulty-attributes.interface';
import { IPerformanceAttributes } from '../../performance/interfaces/performance-attributes.interface';

export interface IBeatmapResponse {
  /**
   * Beatmap ID.
   */
  id: number;

  /**
   * Beatmap MD5 hash.
   */
  hash: string;

  /**
   * Beatmap mode.
   */
  rulesetId: number;

  /**
   * Beatmap mods.
   */
  mods: string;

  /**
   * Is beatmap converted or not?
   */
  isConvert: boolean;

  /**
   * Beatmap graph file name.
   */
  graphFile?: string;

  /**
   * Beatmap ruleset & mods specific information.
   */
  general: IBeatmapGeneral;

  /**
   * Beatmap metadata.
   */
  metadata: IBeatmapMetadata;

  /**
   * Beatmap difficulty attributes.
   */
  difficulty: IDifficultyAttributes;

  /**
   * List of beatmap performance attributes.
   */
  performance: IPerformanceAttributes[];
}

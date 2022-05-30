/**
 * Difficulty attributes of a beatmap.
 */
export interface IDifficultyAttributes {
  /**
   * Mods of this difficulty attributes.
   */
  mods: string;

  /**
   * Total star rating of the beatmap.
   */
  starRating: number;

  /**
   * Total max combo of the beatmap.
   */
  maxCombo: number;
}

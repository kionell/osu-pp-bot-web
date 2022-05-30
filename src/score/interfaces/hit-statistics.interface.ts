export interface IHitStatistics {
  /**
   * Number of Gekis in standard, Max 300s in mania.
   */
  countGeki: number;

  /**
   * Number of 300s.
   */
  count300: number;

  /**
   * Number of Katus in standard, 200s in mania.
   */
  countKatu: number;

  /**
   * Number of 100s in standard, 150s in Taiko, 100s in CTB, 100s in mania.
   */
  count100: number;

  /**
   * Number of 50s in standard, small fruit in CTB, 50s in mania.
   */
  count50: number;

  /**
   * Number of misses.
   */
  countMiss: number;
}

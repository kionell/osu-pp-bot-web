import { GameMode } from '@kionell/osu-pp-calculator';

export class ColorUtils {
  private readonly lineOpacity = 0.7;
  private readonly fillOpacity = 0.2;

  /**
   * Basic chart line colors.
   */
  private readonly ALL_COLORS = [
    [
      `rgba(255, 0, 0, ${this.lineOpacity})`,
      `rgba(178, 0, 0, ${this.fillOpacity})`,
    ], // Red
    [
      `rgba(255, 128, 0, ${this.lineOpacity})`,
      `rgba(178, 89, 0,${this.fillOpacity}`,
    ], // Orange
    [
      `rgba(255, 255, 0, ${this.lineOpacity})`,
      `rgba(178, 178, 0, ${this.fillOpacity})`,
    ], // Yellow
    [
      `rgba(0, 255, 0, ${this.lineOpacity})`,
      `rgba(0, 178, 0, ${this.fillOpacity})`,
    ], // Green
    [
      `rgba(0, 255, 255, ${this.lineOpacity})`,
      `rgba(0, 178, 178, ${this.fillOpacity})`,
    ], // Light Blue
    [
      `rgba(0, 0, 255, ${this.lineOpacity})`,
      `rgba(0, 0, 178, ${this.fillOpacity})`,
    ], // Blue
    [
      `rgba(255, 0, 255, ${this.lineOpacity})`,
      `rgba(178, 0, 178, ${this.fillOpacity})`,
    ], // Purple
  ];

  private readonly OSU_COLORS = [
    this.ALL_COLORS[0], // Red
    this.ALL_COLORS[3], // Yellow
    this.ALL_COLORS[4], // Light Blue
    this.ALL_COLORS[6], // Purple
  ];

  private readonly TAIKO_COLORS = [
    this.ALL_COLORS[0], // Red
    this.ALL_COLORS[3], // Yellow
    this.ALL_COLORS[4], // Light Blue
    this.ALL_COLORS[6], // Purple
  ];

  private readonly CATCH_COLORS = [
    this.ALL_COLORS[4], // Light Blue
  ];

  private readonly MANIA_COLORS = [
    this.ALL_COLORS[6], // Purple
  ];

  getColorsForRuleset(rulesetId?: GameMode): string[][] {
    switch (rulesetId) {
      case GameMode.Osu: return this.OSU_COLORS;
      case GameMode.Taiko: return this.TAIKO_COLORS;
      case GameMode.Fruits: return this.CATCH_COLORS;
      case GameMode.Mania: return this.MANIA_COLORS;
    }

    return this.ALL_COLORS;
  }
}

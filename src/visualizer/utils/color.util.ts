import { GameMode } from '@kionell/osu-pp-calculator';

export class ColorUtils {
  private readonly lineOpacity = 0.75;
  private readonly fillOpacity = 0.25;

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
    ], // Magenta
  ];

  // "Speed is such a red skill tho" (c) Ilmeria
  private readonly OSU_COLORS = [
    this.ALL_COLORS[4], // Light Blue - Aim
    this.ALL_COLORS[3], // Green      - Aim (Sliders)
    this.ALL_COLORS[0], // Red        - Speed
    this.ALL_COLORS[6], // Magenta    - Flashlight
  ];

  private readonly TAIKO_COLORS = [
    this.ALL_COLORS[4], // Light Blue - Rhythm
    this.ALL_COLORS[2], // Yellow     - Colour
    this.ALL_COLORS[0], // Red        - Stamina
  ];

  private readonly CATCH_COLORS = [
    this.ALL_COLORS[4], // Light Blue - Movement
  ];

  private readonly MANIA_COLORS = [
    this.ALL_COLORS[6], // Magenta    - Strain
  ];

  private readonly REPLAY_COLORS = [
    this.ALL_COLORS[3], // Green
    this.ALL_COLORS[3], // Green
    this.ALL_COLORS[3], // Green
    this.ALL_COLORS[2], // Yellow
    this.ALL_COLORS[2], // Yellow
    this.ALL_COLORS[0], // Red
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

  getLifeBarColors(): string[][] {
    return this.REPLAY_COLORS;
  }
}

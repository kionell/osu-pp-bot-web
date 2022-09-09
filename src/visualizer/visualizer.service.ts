import SparkMD5 from 'spark-md5';
import fs from 'fs/promises';
import { Injectable } from '@nestjs/common';
import { GameMode } from '@kionell/osu-pp-calculator';
import { StrainChartService } from './strains/strain-chart.service';
import { IBeatmapStrains } from './strains/interfaces/beatmap-strains.interface';
import { ApiService } from '../api/api.service';
import { ILifeBarFrame } from 'osu-classes';
import { ReplayChartService } from './replays/replay-chart.service';

@Injectable()
export class VisualizerService {
  constructor(
    private apiService: ApiService,
    private strainChartService: StrainChartService,
    private replayChartService: ReplayChartService,
  ) {}

  /**
   * Generates a new PNG image of beatmap strains.
   * @param strains Data for generating strain chart.
   * @param rulesetId Ruleset of the strain chart.
   * @returns Name of the generated file or null.
   */
  async generateStrainChart(strains: IBeatmapStrains, rulesetId?: GameMode): Promise<string | null> {
    const skills = strains.skills;

    if (!skills || !skills.length) return null;

    const backgroundURL = this.getBackgroundURL(strains.beatmapsetId);

    const buffer = await this.strainChartService
      .generateImage(skills, backgroundURL, rulesetId);

    const dirPath = process.env.STRAIN_GRAPH_PATH ?? '';

    return buffer ? this.getFileName(buffer, dirPath) : null;
  }

  /**
   * Generates a new PNG image of beatmap strains.
   * @param lifeBar Data for generating strain chart.
   * @returns Name of the generated file or null.
   */
  async generateReplayChart(lifeBar?: ILifeBarFrame[], beatmapsetId?: number): Promise<string | null> {
    if (!lifeBar || !lifeBar.length) return null;

    const backgroundURL = this.getBackgroundURL(beatmapsetId);

    const buffer = await this.replayChartService
      .generateImage(lifeBar, backgroundURL);

    const dirPath = process.env.REPLAY_GRAPH_PATH ?? '';

    return buffer ? this.getFileName(buffer, dirPath) : null;
  }

  private async getFileName(buffer: Buffer, dirPath: string): Promise<string | null> {
    return new Promise((res) => {
      const fileName = `${SparkMD5.ArrayBuffer.hash(buffer)}.png`;
      const filePath = `${dirPath}/${fileName}`;

      fs.mkdir(dirPath, { recursive: true })
        .then(() => {
          fs.writeFile(filePath, buffer)
            .then(() => res(fileName))
            .catch(() => res(null));
        })
        .catch(() => res(null));
    });
  }

  private getBackgroundURL(beatmapsetId?: number): string | null {
    if (!beatmapsetId || beatmapsetId <= 0) return null;

    const urlGenerator = this.apiService.createURLGenerator();

    return urlGenerator.generateBeatmapCoverURL(beatmapsetId);
  }
}

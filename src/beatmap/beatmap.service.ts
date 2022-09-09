import fs from 'fs';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IBeatmapResponse } from './interfaces/beatmap-response.interface';
import { BeatmapOptionsDto } from './dto/beatmap-options.dto';
import { BeatmapRepository } from './repositories/beatmap.repository';
import { DownloadUtils } from '../api/utils/download.util';
import { CalculatorService } from '../calculator/calculator.service';
import { VisualizerService } from '../visualizer/visualizer.service';

@Injectable()
export class BeatmapService {
  constructor(
    private beatmapRepository: BeatmapRepository,
    private calculatorService: CalculatorService,
    private visualizerService: VisualizerService,
    private downloadUtils: DownloadUtils,
  ) {}

  /**
   * Gets beatmap data from database or calculates it.
   * @param options Beatmap options.
   * @param compact Return beatmap response without performance?
   * @returns Beatmap response.
   */
  async processByDefault(options: BeatmapOptionsDto, compact = false): Promise<IBeatmapResponse> {
    if (!options.beatmapId && !options.fileURL && !options.hash && options.replayURL) {
      const hash = await this.downloadUtils.getBeatmapMD5OrNull(options);

      if (hash) options.hash = hash;
    }

    /**
     * We need to download all files in main thread 
     * because downloader relies on static cache of processed URLs.
     * Workers will simply have different caching instances 
     * which will cause unexpected file changes while beatmap parsing.
     */
    const result = await this.downloadUtils.downloadBeatmap(options);

    console.log(`Beatmap (${result.id || result.url}) download with status: "${result.statusText}"`);

    if (typeof options.hash !== 'string') {
      options.hash = result.md5 as string;
    }

    const rulesetId = await this.getRulesetIdOrNull(options);

    if (typeof rulesetId === 'number') {
      options.rulesetId = rulesetId;
    }

    if (options.recalculate || (!options.beatmapId && !options.hash)) {
      return await this.createAndSaveBeatmap(options);
    }

    const filter = this.beatmapRepository.getFilter(options);
    const cached = await this.beatmapRepository.findOne(filter, compact);

    if (!cached && !options.beatmapId && !options.fileURL) {
      throw new InternalServerErrorException('Beatmap not found!');
    }

    if (!cached) return await this.createAndSaveBeatmap(options);

    const strainGraphPath = process.env.STRAIN_GRAPH_PATH + `/${cached.graphFile}`;

    /**
     * Recalculate beatmap if strain graph is not found.
     * This is a lazy fix for the ephemeral storage problem when all 
     * strain graphs are constantly getting cleared after some short time.
     */
    return await new Promise((res) => {
      fs.promises.access(strainGraphPath, fs.constants.F_OK)
        .then(() => res(cached))
        .catch(async () => res(await this.createAndSaveBeatmap(options)));
    });
  }

  /**
   * Searches for original (not converted) beatmap in database and tries to get it ruleset ID.
   * @param options Beatmap options.
   * @returns Found ruleset ID or null.
   */
  private async getRulesetIdOrNull(options: BeatmapOptionsDto): Promise<number | null> {
    if (!options.beatmapId && !options.hash) {
      return null;
    }

    if (typeof options.rulesetId !== 'number') {
      const filter = this.beatmapRepository.getOriginalFilter(options);
      const original = await this.beatmapRepository.findOne(filter);

      if (original) return original.rulesetId;
    }

    return options.rulesetId ?? null;
  }

  /**
   * Calculates beatmap and draws beatmap strain graph.
   * Result will be saved to database after all calculations.
   * Calculated data will be transformed to beatmap response.
   * @param options Beatmap options.
   * @returns Formatted beatmap response.
   */
  async createAndSaveBeatmap(options: BeatmapOptionsDto): Promise<IBeatmapResponse> {
    const calculated = await this.calculatorService.calculateBeatmap({
      ...options,
      beatmapId: options?.beatmapId,
      rulesetId: options?.rulesetId,
      savePath: process.env.CACHE_PATH,
      strains: true,
    });

    const strains = {
      beatmapsetId: calculated.beatmapInfo.beatmapsetId,
      skills: calculated.skills,
    };

    const rulesetId = calculated.beatmapInfo.rulesetId;

    const graphFileName = await this.visualizerService
      .generateStrainChart(strains, rulesetId);

    return this.beatmapRepository.saveOne(calculated, graphFileName);
  }
}

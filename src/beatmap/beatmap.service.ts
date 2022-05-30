import { Injectable } from '@nestjs/common';
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
    /**
     * We need to download all files in main thread 
     * because downloader relies on static cache of processed URLs.
     * Workers will simply have different caching instances 
     * which will cause unexpected file changes while beatmap parsing.
     */
    const result = await this.downloadUtils.downloadBeatmap(options);

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

    return cached ?? await this.createAndSaveBeatmap(options);
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

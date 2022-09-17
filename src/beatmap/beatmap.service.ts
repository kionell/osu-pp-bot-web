import fs from 'fs';
import { IBeatmapInfo } from 'osu-classes';
import { ICalculatedBeatmap, parseScore } from '@kionell/osu-pp-calculator';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { IBeatmapResponse } from './interfaces/beatmap-response.interface';
import { BeatmapOptionsDto } from './dto/beatmap-options.dto';
import { BeatmapRepository } from './repositories/beatmap.repository';
import { CalculatorService } from '../calculator/calculator.service';
import { VisualizerService } from '../visualizer/visualizer.service';
import { ApiService } from '../api/api.service';
import { downloadBeatmap } from './utils/download.utils';

@Injectable()
export class BeatmapService {
  constructor(
    private beatmapRepository: BeatmapRepository,
    private calculatorService: CalculatorService,
    private visualizerService: VisualizerService,
    private apiService: ApiService,
  ) {}

  async processBeatmap(options: BeatmapOptionsDto, compact = false): Promise<IBeatmapResponse> {
    if (options.beatmapId || options.hash || options.fileURL || options.search) {
      return this.processDefault(options, compact);
    }

    if (options.replayURL) {
      return this.processByReplay(options, compact);
    }

    throw new BadRequestException('Not enough data to get a beatmap!');
  }

  /**
   * This function tries to handle the case when we have only replay URL or search query.
   * Possible ways to get beatmap response:
   *  1) Find it in the database by using beatmap MD5 checksum from replay.
   * 
   * Possible ways to recalculate beatmap:
   *  1) By getting beatmap ID from cached response.
   *  2) By getting beatmap ID from the osu! API using MD5 from replay.
   * 
   * Limitations:
   *  1) Unsubmitted beatmaps can't be recalculated with this function as we don't have file URL.
   *  2) Beatmaps can't be found in the database without replay URL.
   * 
   * @param options Beatmap options.
   * @param compact Return beatmap response without performance?
   * @returns Beatmap response.
   */
  async processByReplay(options: BeatmapOptionsDto, compact = false): Promise<IBeatmapResponse> {
    const score = await parseScore({
      replayURL: options.replayURL,
      savePath: process.env.CACHE_PATH,
      lifeBar: false,
    });

    options.hash = score.data.info.beatmapHashMD5;
    options.mods ??= score.data.info.rawMods;
    options.rulesetId ??= score.data.info.rulesetId;

    if (!options.hash) {
      throw new InternalServerErrorException('Failed to get beatmap MD5 from the replay file!');
    }

    return this.processDefault(options, compact);
  }

  /**
   * This function is for default case when we have at least one of these:
   *  1) beatmap ID;
   *  2) beatmap file URL;
   *  3) beatmap MD5 checksum;
   *  4) beatmap search query.
   * We can get beatmap response directly from the database or calculate it.
   * @param options Beatmap options.
   * @param compact Return beatmap response without performance?
   * @returns Beatmap response.
   */
  private async processDefault(options: BeatmapOptionsDto, compact: boolean): Promise<IBeatmapResponse> {
    let originalInfo: IBeatmapInfo | null = null;

    if (!options.beatmapId && !options.fileURL && (options.hash || options.search)) {
      originalInfo = await this.apiService.getBeatmap(options.server, options);

      options.beatmapId ||= originalInfo?.id;
      options.hash ||= originalInfo?.md5;
    }

    // This is possible only if we had search query and nothing else.
    if (!options.beatmapId && !options.fileURL && !options.hash) {
      throw new InternalServerErrorException('Beatmap not found!');
    }

    /**
     * We need to download all files in main thread 
     * because downloader relies on static cache of processed URLs.
     * Workers will simply have different caching instances 
     * which will cause unexpected file changes while beatmap parsing.
     */
    const result = await downloadBeatmap(options);

    if (result.md5) options.hash ??= result.md5;

    if (options.recalculate) {
      return await this.createAndSaveBeatmap(options, originalInfo);
    }

    const filter = this.beatmapRepository.getFilter(options);
    const cached = await this.beatmapRepository.findOne(filter, compact);

    if (!cached) {
      return await this.createAndSaveBeatmap(options, originalInfo);
    }

    const strainGraphPath = process.env.STRAIN_GRAPH_PATH + `/${cached.graphFile}`;

    /**
     * Recalculate beatmap if strain graph is not found.
     * This is a lazy fix for the ephemeral storage problem when all 
     * strain graphs are constantly getting cleared after some short time.
     */
    return await new Promise((res) => {
      fs.promises.access(strainGraphPath, fs.constants.F_OK)
        .then(() => res(cached))
        .catch(async () => res(await this.createAndSaveBeatmap(options, originalInfo)));
    });
  }

  /**
   * Calculates beatmap and draws beatmap strain graph.
   * Result will be saved to database after all calculations.
   * Calculated data will be transformed to beatmap response.
   * @param options Beatmap options.
   * @param originalInfo Beatmap information or null.
   * @returns Formatted beatmap response.
   */
  async createAndSaveBeatmap(options: BeatmapOptionsDto, originalInfo: IBeatmapInfo | null): Promise<IBeatmapResponse> {
    const calculated = await this.createBeatmap(options, originalInfo);

    const strains = {
      beatmapsetId: calculated.beatmapInfo.beatmapsetId,
      skills: calculated.skills,
    };

    const rulesetId = calculated.beatmapInfo.rulesetId;

    const graphFileName = await this.visualizerService
      .generateStrainChart(strains, rulesetId);

    return this.beatmapRepository.saveOne(calculated, graphFileName);
  }

  /**
   * Calculates beatmap and performs a request to get beatmap info.
   * @param options Beatmap options.
   * @param originalInfo Beatmap information or null.
   * @returns Calculated beatmap with beatmap info from the API.
   */
  async createBeatmap(options: BeatmapOptionsDto, originalInfo: IBeatmapInfo | null): Promise<ICalculatedBeatmap> {
    const calculationOptions = {
      ...options,
      savePath: process.env.CACHE_PATH,
      strains: true,
    };

    let beatmapInfo = originalInfo;
    let calculated = null;

    if (originalInfo) {
      calculated = await this.calculatorService.calculateBeatmap(calculationOptions);
    }
    else {
      /**
       * We can save some time by starting the calculation 
       * without waiting for the result of the request.
       */
      const awaited = await Promise.all([
        this.apiService.getBeatmap(options.server, options),
        this.calculatorService.calculateBeatmap(calculationOptions),
      ]);

      beatmapInfo = awaited[0] as IBeatmapInfo | null;
      calculated = awaited[1] as ICalculatedBeatmap;
    }

    if (beatmapInfo) {
      calculated.beatmapInfo.beatmapsetId = beatmapInfo.beatmapsetId;
      calculated.beatmapInfo.creatorId = beatmapInfo.creatorId;
      calculated.beatmapInfo.favourites = beatmapInfo.favourites;
      calculated.beatmapInfo.passcount = beatmapInfo.passcount;
      calculated.beatmapInfo.playcount = beatmapInfo.playcount;
      calculated.beatmapInfo.status = beatmapInfo.status;
      calculated.beatmapInfo.deletedAt = beatmapInfo.deletedAt;
      calculated.beatmapInfo.updatedAt = beatmapInfo.updatedAt;
    }

    return calculated;
  }
}

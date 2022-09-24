import { IScoreInfo } from 'osu-classes';
import { Injectable } from '@nestjs/common';
import { IScoreCalculationOptions } from '@kionell/osu-pp-calculator';
import { IScoreResponse } from './interfaces/score-response.interface';
import { ScoreOptionsDto } from './dto/score-options.dto';
import { ScoreRepository } from './repositories/score.repository';
import { ApiService } from '../api/api.service';
import { CalculatorService } from '../calculator/calculator.service';
import { BeatmapService } from '../beatmap/beatmap.service';
import { ConversionUtils } from '../beatmap/utils/conversion.util';
import { VisualizerService } from '../visualizer/visualizer.service';

@Injectable()
export class ScoreService {
  constructor(
    private apiService: ApiService,
    private visualizerService: VisualizerService,
    private beatmapService: BeatmapService,
    private calculatorService: CalculatorService,
    private scoreRepository: ScoreRepository,
    private conversionUtils: ConversionUtils,
  ) {}

  /**
   * This method handles precalculated scores and replays.
   * @param options Score options.
   * @param simulate Should we simulate score or calculate it as it is?
   * @param scoreInfo If we have precalculated score info.
   * @returns Score response.
   */
  async processByDefault(options: ScoreOptionsDto, simulate = false, scoreInfo?: IScoreInfo): Promise<IScoreResponse> {
    const beatmap = await this.beatmapService.processBeatmap({
      beatmapId: options.beatmapId ?? scoreInfo?.beatmapId,
      fileURL: options.fileURL,
      replayURL: options.replayURL,
      hash: options.hash ?? scoreInfo?.beatmapHashMD5,
      search: options.search,
      rulesetId: options.rulesetId ?? scoreInfo?.rulesetId,
      mods: options.mods ?? scoreInfo?.mods?.toString() ?? scoreInfo?.rawMods,
      approachRate: options.approachRate,
      overallDifficulty: options.overallDifficulty,
      circleSize: options.circleSize,
      clockRate: options.clockRate,
      bpm: options.bpm,
    }, true);

    const attributes = this.conversionUtils.createBeatmapAttributes(beatmap);

    const scoreOptions: IScoreCalculationOptions = {
      ...options,
      savePath: process.env.CACHE_PATH,
      beatmapId: beatmap.id,
      fileURL: beatmap.fileURL,
      rulesetId: beatmap.rulesetId,
      mods: beatmap.mods,
      difficulty: beatmap.difficulty,
      scoreInfo: scoreInfo?.toJSON(),
      attributes,
    };

    if (options.replayURL) {
      scoreOptions.lifeBar = true;
    }

    /**
     * We need to remove replay if we are trying to simulate score.
     * Replay has higher priority over custom counts so it will overwrite options. 
     */
    if (simulate) delete scoreOptions.replayURL;

    const calculated = simulate
      ? await this.calculatorService.simulateScore(scoreOptions)
      : await this.calculatorService.calculateScore(scoreOptions);

    let graphFileName = null;

    if (options.drawGraph) {
      graphFileName = await this.visualizerService.generateReplayChart(
        calculated.lifeBar,
        beatmap.metadata.beatmapsetId,
      );
    }

    return this.scoreRepository.createOne(calculated, beatmap, graphFileName);
  }

  /**
   * This is the case when we need to request score data from another API.
   * @param options Score options.
   * @param simulate Simulate score or calculate it as it is?
   * @returns Score response.
   */
  async processByScoreId(options: ScoreOptionsDto, simulate = false): Promise<IScoreResponse> {
    const scoreInfo = await this.apiService.getScore(options.server, {
      scoreId: options.scoreId as number,
      mode: options.rulesetId,
    });

    if (scoreInfo !== null) {
      return this.processByDefault(options, simulate, scoreInfo);
    }

    return this.processByDefault(options, simulate);
  }
}

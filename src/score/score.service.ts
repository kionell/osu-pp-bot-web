import { IScoreInfo } from 'osu-classes';
import { Injectable } from '@nestjs/common';
import { IScoreResponse } from './interfaces/score-response.interface';
import { ScoreOptionsDto } from './dto/score-options.dto';
import { ScoreRepository } from './repositories/score.repository';
import { ApiService } from '../api/api.service';
import { CalculatorService } from '../calculator/calculator.service';
import { BeatmapService } from '../beatmap/beatmap.service';
import { ConversionUtils } from '../beatmap/utils/conversion.util';

@Injectable()
export class ScoreService {
  constructor(
    private apiService: ApiService,
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
    const beatmap = await this.beatmapService.processByDefault({
      beatmapId: options.beatmapId ?? scoreInfo?.beatmapId,
      fileURL: options.fileURL,
      replayURL: options.replayURL,
      hash: options.hash ?? scoreInfo?.beatmapHashMD5,
      search: options.search,
      rulesetId: options.rulesetId ?? scoreInfo?.rulesetId,
      mods: options.mods ?? scoreInfo?.mods?.toString() ?? scoreInfo?.rawMods,
    }, true);

    const attributes = this.conversionUtils.createBeatmapAttributes(beatmap);

    const scoreOptions = {
      ...options,
      savePath: process.env.CACHE_PATH,
      beatmapId: beatmap.id,
      rulesetId: beatmap.rulesetId,
      mods: beatmap.mods,
      difficulty: beatmap.difficulty,
      scoreInfo: scoreInfo?.toJSON(),
      attributes,
    };

    /**
     * We need to remove replay if we are trying to simulate score.
     * Replay has higher priority over custom counts so it will overwrite options. 
     */
    if (simulate || options.fix) delete scoreOptions.replayURL;

    const calculated = simulate || options.fix
      ? await this.calculatorService.simulateScore(scoreOptions)
      : await this.calculatorService.calculateScore(scoreOptions);

    return this.scoreRepository.createOne(calculated, beatmap);
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

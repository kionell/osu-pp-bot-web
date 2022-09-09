import { Model, LeanDocument } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ICalculatedScore } from '@kionell/osu-pp-calculator';
import { Injectable } from '@nestjs/common';
import { Score, ScoreDocument } from '../models/score.model';
import { HitStatistics } from '../models/hit-statistics.model';
import { IScoreResponse } from '../interfaces/score-response.interface';
import { PerformanceRepository } from '../../performance/performance.repository';
import { IBeatmapResponse } from '../../beatmap/interfaces/beatmap-response.interface';

@Injectable()
export class ScoreRepository {
  constructor(
    @InjectModel(Score.name)
    private scoreModel: Model<Score>,

    @InjectModel(HitStatistics.name)
    private statisticsModel: Model<HitStatistics>,
    private performanceRepository: PerformanceRepository,
  ) {}

  async createOne(data: ICalculatedScore, beatmap: IBeatmapResponse, graphFileName: string | null): Promise<IScoreResponse> {
    const { scoreInfo, performance } = data;

    const createdStatistics = new this.statisticsModel(scoreInfo);

    const createdPerformance = this.performanceRepository
      .createOne(performance, scoreInfo.rulesetId);

    const score = new this.scoreModel({
      ...scoreInfo,
      statistics: createdStatistics,
      performance: createdPerformance,
      graphFile: graphFileName,
    });

    return {
      ...this.transformData(score),
      beatmap,
    };
  }

  private transformData(document: ScoreDocument): LeanDocument<Score> {
    const obj = document.toObject<Score>({
      useProjection: true,
    });

    const removeProps = (o: any) => {
      delete o._id; delete o.__v; delete o.__t;
    };

    removeProps(obj);
    removeProps(obj.statistics);
    removeProps(obj.performance);

    return obj;
  }
}

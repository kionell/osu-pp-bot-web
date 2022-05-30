import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Performance, PerformanceDocument } from './models/performance.model';
import { OsuPerformance, OsuPerformanceDocument } from './models/osu-performance.model';
import { TaikoPerformance, TaikoPerformanceDocument } from './models/taiko-performance.model.';
import { CatchPerformance, CatchPerformanceDocument } from './models/catch-performance.model';
import { ManiaPerformance, ManiaPerformanceDocument } from './models/mania-performance.model';
import { PerformanceAttributes } from 'osu-classes';
import { GameMode } from '@kionell/osu-pp-calculator';

@Injectable()
export class PerformanceRepository {
  constructor(
    @InjectModel(Performance.name)
    private performanceModel: Model<PerformanceDocument>,

    @InjectModel(OsuPerformance.name)
    private osuPerformanceModel: Model<OsuPerformanceDocument>,

    @InjectModel(TaikoPerformance.name)
    private taikoPerformanceModel: Model<TaikoPerformanceDocument>,

    @InjectModel(CatchPerformance.name)
    private catchPerformanceModel: Model<CatchPerformanceDocument>,

    @InjectModel(ManiaPerformance.name)
    private maniaPerformanceModel: Model<ManiaPerformanceDocument>,
  ) {}

  createOne(performance: PerformanceAttributes, rulesetId: number): Performance {
    const Model = this.getModel(rulesetId);

    const document = new Model({
      ...performance,
      mods: performance.mods.toString(),
    });

    return document.toObject({
      useProjection: true,
    });
  }

  private getModel(rulesetId: number): Model<PerformanceDocument> {
    switch (rulesetId) {
      case GameMode.Osu:
        return this.osuPerformanceModel as any;

      case GameMode.Taiko:
        return this.taikoPerformanceModel as any;

      case GameMode.Fruits:
        return this.catchPerformanceModel as any;

      case GameMode.Mania:
        return this.maniaPerformanceModel as any;
    }

    return this.performanceModel;
  }
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScoreController } from './score.controller';
import { ScoreService } from './score.service';
import { ScoreRepository } from './repositories/score.repository';
import { Score, ScoreSchema } from './models/score.model';
import { HitStatistics, HitStatisticsSchema } from './models/hit-statistics.model';
import { ApiModule } from '../api/api.module';
import { BeatmapModule } from '../beatmap/beatmap.module';
import { CalculatorModule } from '../calculator/calculator.module';
import { PerformanceModule } from '../performance/performance.module';
import { VisualizerModule } from '../visualizer/visualizer.module';

@Module({
  controllers: [ScoreController],
  providers: [
    ScoreService,
    ScoreRepository,
  ],
  imports: [
    ApiModule,
    BeatmapModule,
    CalculatorModule,
    PerformanceModule,
    VisualizerModule,
    MongooseModule.forFeature([
      {
        name: Score.name,
        schema: ScoreSchema,
      },
      {
        name: HitStatistics.name,
        schema: HitStatisticsSchema,
      },
    ]),
  ],
})
export class ScoreModule {}

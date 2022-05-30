import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PerformanceRepository } from './performance.repository';
import { Performance, PerformanceSchema } from './models/performance.model';
import { OsuPerformance, OsuPerformanceSchema } from './models/osu-performance.model';
import { TaikoPerformance, TaikoPerformanceSchema } from './models/taiko-performance.model.';
import { CatchPerformance, CatchPerformanceSchema } from './models/catch-performance.model';
import { ManiaPerformance, ManiaPerformanceSchema } from './models/mania-performance.model';

@Module({
  providers: [PerformanceRepository],
  exports: [PerformanceRepository],
  imports: [
    MongooseModule.forFeature([
      {
        name: Performance.name,
        schema: PerformanceSchema,
        discriminators: [
          {
            name: OsuPerformance.name,
            schema: OsuPerformanceSchema,
          },
          {
            name: TaikoPerformance.name,
            schema: TaikoPerformanceSchema,
          },
          {
            name: CatchPerformance.name,
            schema: CatchPerformanceSchema,
          },
          {
            name: ManiaPerformance.name,
            schema: ManiaPerformanceSchema,
          },
        ],
      },
    ]),
  ],
})
export class PerformanceModule {}

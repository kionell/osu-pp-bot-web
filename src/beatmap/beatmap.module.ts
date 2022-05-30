import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BeatmapController } from './beatmap.controller';
import { BeatmapService } from './beatmap.service';
import { BeatmapGeneral, BeatmapGeneralSchema } from './models/beatmap-general.model';
import { BeatmapMetadata, BeatmapMetadataSchema } from './models/beatmap-metadata.model';
import { Beatmap, BeatmapSchema } from './models/beatmap.model';
import { BeatmapRepository } from './repositories/beatmap.repository';
import { BeatmapGeneralRepository } from './repositories/beatmap-general.repository';
import { BeatmapMetadataRepository } from './repositories/beatmap-metadata.repository';
import { CatchBeatmapGeneral, CatchBeatmapGeneralSchema } from './models/catch-beatmap-general.model';
import { ConversionUtils } from './utils/conversion.util';
import { ApiModule } from '../api/api.module';
import { CalculatorModule } from '../calculator/calculator.module';
import { DifficultyModule } from '../difficulty/difficulty.module';
import { PerformanceModule } from '../performance/performance.module';
import { VisualizerModule } from '../visualizer/visualizer.module';

@Module({
  controllers: [BeatmapController],
  providers: [
    BeatmapService,
    BeatmapRepository,
    BeatmapGeneralRepository,
    BeatmapMetadataRepository,
    ConversionUtils,
  ],
  exports: [
    BeatmapService,
    ConversionUtils,
  ],
  imports: [
    ApiModule,
    CalculatorModule,
    DifficultyModule,
    PerformanceModule,
    VisualizerModule,
    MongooseModule.forFeature([
      {
        name: Beatmap.name,
        schema: BeatmapSchema,
      },
      {
        name: BeatmapGeneral.name,
        schema: BeatmapGeneralSchema,
        discriminators: [
          {
            name: CatchBeatmapGeneral.name,
            schema: CatchBeatmapGeneralSchema,
          },
        ],
      },
      {
        name: BeatmapMetadata.name,
        schema: BeatmapMetadataSchema,
      },
    ]),
  ],
})
export class BeatmapModule {}

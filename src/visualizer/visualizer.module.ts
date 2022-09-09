import { Module } from '@nestjs/common';
import { ApiModule } from '../api/api.module';
import { ReplayChartService } from './replays/replay-chart.service';
import { StrainChartService } from './strains/strain-chart.service';
import { ColorUtils } from './utils/color.util';
import { VisualizerService } from './visualizer.service';

@Module({
  providers: [
    VisualizerService,
    StrainChartService,
    ReplayChartService,
    ColorUtils,
  ],
  imports: [
    ApiModule,
  ],
  exports: [
    VisualizerService,
  ],
})
export class VisualizerModule {}

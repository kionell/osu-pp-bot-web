import { Module } from '@nestjs/common';
import { ApiModule } from '../api/api.module';
import { ColorUtils } from './utils/color.util';
import { VisualizerService } from './visualizer.service';

@Module({
  providers: [
    VisualizerService,
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

import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { BeatmapOptionsDto } from './dto/beatmap-options.dto';
import { BeatmapService } from './beatmap.service';
import { IBeatmapResponse } from './interfaces/beatmap-response.interface';
import { AllExceptionsFilter } from '../exceptions/all-exeption.fitler';

@Controller('/api/v1')
@UseFilters(AllExceptionsFilter)
export class BeatmapController {

  constructor(private readonly beatmapService: BeatmapService) {}

  @Post('/beatmaps')
  async calculateBeatmap(@Body() options: BeatmapOptionsDto): Promise<IBeatmapResponse> {
    return this.beatmapService.processBeatmap(options);
  }
}

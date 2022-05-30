import { BadRequestException, Body, Controller, Post, UseFilters } from '@nestjs/common';
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
    const hasBeatmapId = typeof options.beatmapId === 'number';
    const hasMD5 = typeof options.hash === 'string';
    const hasSearch = typeof options.search === 'string';

    if (hasBeatmapId || hasMD5 || hasSearch) {
      return this.beatmapService.processByDefault(options);
    }

    const hasBeatmapFileURL = typeof options.fileURL === 'string';
    const hasReplayFileURL = typeof options.replayURL === 'string';

    if (hasBeatmapFileURL || hasReplayFileURL) {
      return this.beatmapService.processByDefault(options);
    }

    throw new BadRequestException('Beatmap not found!');
  }
}

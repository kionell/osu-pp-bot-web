import { BadRequestException, Body, Controller, Post, UseFilters } from '@nestjs/common';
import { ScoreOptionsDto } from './dto/score-options.dto';
import { ScoreService } from './score.service';
import { IScoreResponse } from './interfaces/score-response.interface';
import { AllExceptionsFilter } from '../exceptions/all-exeption.fitler';

@Controller('/api/v1')
@UseFilters(AllExceptionsFilter)
export class ScoreController {

  constructor(private readonly scoreService: ScoreService) {}

  @Post('/scores')
  async calculateScore(@Body() options: ScoreOptionsDto): Promise<IScoreResponse> {
    return this.processScore(options);
  }

  @Post('/scores/simulate')
  async simulateScore(@Body() options: ScoreOptionsDto): Promise<IScoreResponse> {
    return this.processScore(options, true);
  }

  private async processScore(options: ScoreOptionsDto, simulate = false): Promise<IScoreResponse> {
    const hasBeatmapId = typeof options.beatmapId === 'number';
    const hasSearch = typeof options.search === 'string';

    if (hasBeatmapId || hasSearch) {
      return this.scoreService.processByDefault(options, simulate);
    }

    const hasBeatmapFileURL = typeof options.fileURL === 'string';
    const hasReplayFileURL = typeof options.replayURL === 'string';

    if (hasBeatmapFileURL || hasReplayFileURL) {
      return this.scoreService.processByDefault(options, simulate);
    }

    const hasScoreId = typeof options.scoreId === 'number';
    const hasRulesetId = typeof options.rulesetId === 'number';

    if (hasScoreId && hasRulesetId) {
      return this.scoreService.processByScoreId(options, simulate);
    }

    throw new BadRequestException('Score can\'t be calculated!');
  }
}

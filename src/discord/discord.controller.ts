import { BadRequestException, Body, Controller, Get, Post, Param, UseFilters } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { AllExceptionsFilter } from '../exceptions/all-exeption.fitler';
import { IDiscordChannelResponse } from './interfaces/discord-channel-response.interface';
import { DiscordChannelDto } from './dto/discord-channel.dto';

@Controller('/api/v1')
@UseFilters(AllExceptionsFilter)
export class DiscordController {
  constructor(private readonly discordService: DiscordService) {}

  @Get('/discord/channels/:id')
  async getChannel(@Param('id') channelId: string | number): Promise<IDiscordChannelResponse> {
    const cached = await this.discordService.findOne(channelId);

    if (cached) return cached;

    throw new BadRequestException('Discord channel not found!');
  }

  @Post('/discord/channels')
  async createChannel(@Body() channelDto: DiscordChannelDto): Promise<IDiscordChannelResponse> {
    const { id, server } = channelDto;

    const hasChannelId = typeof id === 'number' || typeof id === 'string';

    const hasValidServerId = typeof server?.id === 'number'
      || typeof server?.id === 'string'
      || typeof server === 'undefined'
      || server === null;

    if (hasChannelId && hasValidServerId) {
      return this.discordService.saveOne(channelDto);
    }

    throw new BadRequestException('Wrong discord channel data!');
  }
}

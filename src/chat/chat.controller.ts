import { BadRequestException, Body, Controller, Get, Post, Param, UseFilters, NotFoundException } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AllExceptionsFilter } from '../exceptions/all-exeption.fitler';
import { IChannelResponse } from './interfaces/channel-response.interface';
import { ChannelDto } from './dto/channel.dto';

@Controller('/api/v1')
@UseFilters(AllExceptionsFilter)
export class ChatController {
  constructor(private readonly ChatService: ChatService) {}

  @Get('/chat/channels/:id')
  async getChannel(@Param('id') channelId: string | number): Promise<IChannelResponse> {
    const cached = await this.ChatService.findOne(channelId);

    if (cached) return cached;

    throw new NotFoundException('Chat channel not found!');
  }

  @Post('/chat/channels')
  async createChannel(@Body() channelDto: ChannelDto): Promise<IChannelResponse> {
    const { id, server } = channelDto;

    const hasChannelId = typeof id === 'number' || typeof id === 'string';

    const hasValidServerId = typeof server?.id === 'number'
      || typeof server?.id === 'string'
      || typeof server === 'undefined'
      || server === null;

    if (hasChannelId && hasValidServerId) {
      return this.ChatService.saveOne(channelDto);
    }

    throw new BadRequestException('Wrong Chat channel data!');
  }
}

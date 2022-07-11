import { Injectable } from '@nestjs/common';
import { ChannelDto } from './dto/channel.dto';
import { IChannelResponse } from './interfaces/channel-response.interface';
import { ChannelRepository } from './repositories/channel.repository';

@Injectable()
export class ChatService {
  constructor(private ChatChannelRepository: ChannelRepository) {}

  /**
   * Tries to find cached Chat channel by its ID.
   * @param channelId Chat channel ID.
   * @returns Chat channel response or null.
   */
  async findOne(channelId: string | number): Promise<IChannelResponse | null> {
    return this.ChatChannelRepository.findOne(channelId);
  }

  /**
   * Tries to find cached Chat channel by its ID.
   * @param channelDto Chat channel DTO.
   * @returns Chat channel response or null.
   */
  async saveOne(channelDto: ChannelDto): Promise<IChannelResponse> {
    return this.ChatChannelRepository.upsertOne(channelDto);
  }
}

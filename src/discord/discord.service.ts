import { Injectable } from '@nestjs/common';
import { DiscordChannelDto } from './dto/discord-channel.dto';
import { IDiscordChannelResponse } from './interfaces/discord-channel-response.interface';
import { DiscordChannelRepository } from './repositories/discord-channel.repository';

@Injectable()
export class DiscordService {
  constructor(private discordChannelRepository: DiscordChannelRepository) {}

  /**
   * Tries to find cached discord channel by its ID.
   * @param channelId Discord channel ID.
   * @returns Discord channel response or null.
   */
  async findOne(channelId: string | number): Promise<IDiscordChannelResponse | null> {
    return this.discordChannelRepository.findOne(channelId);
  }

  /**
   * Tries to find cached discord channel by its ID.
   * @param channelDto Discord channel DTO.
   * @returns Discord channel response or null.
   */
  async saveOne(channelDto: DiscordChannelDto): Promise<IDiscordChannelResponse> {
    return this.discordChannelRepository.upsertOne(channelDto);
  }
}

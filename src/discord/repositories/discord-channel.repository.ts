import { Model, LeanDocument } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IDiscordChannelResponse } from '../interfaces/discord-channel-response.interface';
import { DiscordChannel } from '../models/discord-channel.model';
import { DiscordChannelDto } from '../dto/discord-channel.dto';
import { DiscordServerRepository } from './discord-server.repository';

@Injectable()
export class DiscordChannelRepository {
  constructor(
    @InjectModel(DiscordChannel.name)
    private discordChannelModel: Model<DiscordChannel>,
    private discordServerRepository: DiscordServerRepository,
  ) {}

  async upsertOne(channelDto: DiscordChannelDto): Promise<IDiscordChannelResponse> {
    const filter = {
      id: channelDto.id,
    };

    const data: Partial<DiscordChannel> = {
      id: channelDto.id.toString(),
      beatmapId: channelDto.beatmapId,
    };

    if (channelDto.server) {
      data.server = await this.discordServerRepository.upsertOne(channelDto.server);
    }

    const query = this.discordChannelModel.findOneAndUpdate(
      filter,
      data,
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    const upserted = await query.populate('server')
      .lean()
      .exec();

    return this.transformData(upserted);
  }

  /**
   * Tries to find cached discord channel by its ID.
   * @param channelId Discord channel ID.
   * @returns Discord channel or null.
   */
  async findOne(channelId: string | number): Promise<IDiscordChannelResponse | null> {
    const found = await this.discordChannelModel
      .findOne({ id: channelId })
      .populate('server')
      .lean()
      .exec();

    return found ? this.transformData(found) : null;
  }

  async deleteOne(channelId: string | number): Promise<IDiscordChannelResponse | null> {
    const deleted = await this.discordChannelModel
      .findOneAndDelete({ id: channelId })
      .populate('server')
      .lean()
      .exec();

    return deleted ? this.transformData(deleted) : null;
  }

  private transformData(obj: LeanDocument<DiscordChannel>): LeanDocument<DiscordChannel> {
    const removeProps = (o: any) => {
      delete o._id; delete o.__v; delete o.__t;
    };

    removeProps(obj);

    if (obj.server) removeProps(obj.server);

    return obj;
  }
}

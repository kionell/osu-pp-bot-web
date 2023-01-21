import { Model, LeanDocument } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IChannelResponse } from '../interfaces/channel-response.interface';
import { Channel } from '../models/channel.model';
import { ChannelDto } from '../dto/channel.dto';
import { ServerRepository } from './server.repository';

@Injectable()
export class ChannelRepository {
  constructor(
    @InjectModel(Channel.name)
    private ChannelModel: Model<Channel>,
    private ServerRepository: ServerRepository,
  ) {}

  async upsertOne(channelDto: ChannelDto): Promise<IChannelResponse> {
    const filter = {
      id: channelDto.id,
    };

    const data: Partial<Channel> = {
      id: channelDto.id.toString(),
      beatmapId: channelDto.beatmapId as number,
      beatmapMD5: channelDto.beatmapMD5 as string,
    };

    if (channelDto.server) {
      data.server = await this.ServerRepository.upsertOne(channelDto.server);
    }

    const query = this.ChannelModel.findOneAndUpdate(
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
   * Tries to find cached  channel by its ID.
   * @param channelId  channel ID.
   * @returns  channel or null.
   */
  async findOne(channelId: string | number): Promise<IChannelResponse | null> {
    const found = await this.ChannelModel
      .findOne({ id: channelId })
      .populate('server')
      .lean()
      .exec();

    return found ? this.transformData(found) : null;
  }

  async deleteOne(channelId: string | number): Promise<IChannelResponse | null> {
    const deleted = await this.ChannelModel
      .findOneAndDelete({ id: channelId })
      .populate('server')
      .lean()
      .exec();

    return deleted ? this.transformData(deleted) : null;
  }

  private transformData(obj: LeanDocument<Channel>): LeanDocument<Channel> {
    const removeProps = (o: any) => {
      delete o._id; delete o.__v; delete o.__t;
    };

    removeProps(obj);

    if (obj.server) removeProps(obj.server);

    return obj;
  }
}

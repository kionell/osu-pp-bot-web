import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DiscordServer } from '../models/discord-server.model';
import { DiscordServerDto } from '../dto/discord-server.dto';

@Injectable()
export class DiscordServerRepository {
  constructor(
    @InjectModel(DiscordServer.name)
    private discordServerModel: Model<DiscordServer>,
  ) {}

  async upsertOne(serverDto: DiscordServerDto): Promise<DiscordServer> {
    const filter = {
      id: serverDto.id,
    };

    const data: Partial<DiscordServer> = {
      id: serverDto.id.toString(),
    };

    if (typeof serverDto.prefix === 'string' || serverDto.prefix === null) {
      data.prefix = serverDto.prefix;
    }

    return this.discordServerModel
      .findOneAndUpdate(filter, data, { upsert: true, new: true })
      .lean()
      .exec();
  }

  /**
   * Tries to find cached discord server by its ID.
   * @param serverId Discord server ID.
   * @returns Discord server or null.
   */
  async findOne(serverId: string | number): Promise<DiscordServer | null> {
    return this.discordServerModel
      .findOne({ id: serverId })
      .lean()
      .exec();
  }

  async deleteOne(serverId: string | number): Promise<DiscordServer | null> {
    return this.discordServerModel
      .findOneAndDelete({ id: serverId })
      .lean()
      .exec();
  }
}

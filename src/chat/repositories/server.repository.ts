import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Server } from '../models/server.model';
import { ServerDto } from '../dto/server.dto';

@Injectable()
export class ServerRepository {
  constructor(
    @InjectModel(Server.name)
    private ServerModel: Model<Server>,
  ) {}

  async upsertOne(serverDto: ServerDto): Promise<Server> {
    const filter = {
      id: serverDto.id,
    };

    const data: Partial<Server> = {
      id: serverDto.id.toString(),
    };

    if (typeof serverDto.prefix === 'string' || serverDto.prefix === null) {
      data.prefix = serverDto.prefix;
    }

    return this.ServerModel
      .findOneAndUpdate(filter, data, { upsert: true, new: true })
      .lean()
      .exec();
  }

  /**
   * Tries to find cached  server by its ID.
   * @param serverId  server ID.
   * @returns  server or null.
   */
  async findOne(serverId: string | number): Promise<Server | null> {
    return this.ServerModel
      .findOne({ id: serverId })
      .lean()
      .exec();
  }

  async deleteOne(serverId: string | number): Promise<Server | null> {
    return this.ServerModel
      .findOneAndDelete({ id: serverId })
      .lean()
      .exec();
  }
}

import { IJsonableBeatmapInfo } from 'osu-classes';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BeatmapMetadata } from '../models/beatmap-metadata.model';

@Injectable()
export class BeatmapMetadataRepository {
  constructor(
    @InjectModel(BeatmapMetadata.name)
    private beatmapMetadataModel: Model<BeatmapMetadata>,
  ) {}

  async createOne(beatmapInfo: IJsonableBeatmapInfo): Promise<BeatmapMetadata> {
    const data: Partial<BeatmapMetadata> = {
      ...beatmapInfo,
      beatmapId: beatmapInfo.id,
      hash: beatmapInfo.md5,
    };

    return new this.beatmapMetadataModel(data).toObject();
  }

  async saveOne(beatmapInfo: IJsonableBeatmapInfo): Promise<BeatmapMetadata> {
    const filter: Partial<BeatmapMetadata> = {
      beatmapId: beatmapInfo.id,
      hash: beatmapInfo.md5,
    };

    const data = { ...beatmapInfo, ...filter };

    return this.beatmapMetadataModel
      .findOneAndUpdate(filter, data, { upsert: true, new: true })
      .lean()
      .exec();
  }
}

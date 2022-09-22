import { GameMode, IBeatmapAttributes, toDifficultyMods } from '@kionell/osu-pp-calculator';
import { IJsonableBeatmapInfo } from 'osu-classes';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BeatmapGeneral } from '../models/beatmap-general.model';
import { CatchBeatmapGeneral } from '../models/catch-beatmap-general.model';

@Injectable()
export class BeatmapGeneralRepository {
  constructor(
    @InjectModel(BeatmapGeneral.name)
    private beatmapGeneralModel: Model<BeatmapGeneral>,

    @InjectModel(CatchBeatmapGeneral.name)
    private catchBeatmapGeneralModel: Model<CatchBeatmapGeneral>,
  ) {}

  async createOne(beatmapInfo: IJsonableBeatmapInfo, attributes: IBeatmapAttributes): Promise<BeatmapGeneral> {
    const { id, md5, mods, rulesetId } = beatmapInfo;

    const targetMods = toDifficultyMods(mods, rulesetId);

    const data: Partial<CatchBeatmapGeneral> = {
      ...beatmapInfo,
      totalHits: attributes.totalHits,
      maxFruits: attributes.maxFruits,
      maxDroplets: attributes.maxDroplets,
      maxTinyDroplets: attributes.maxTinyDroplets,
      clockRate: attributes.clockRate,
      mods: targetMods.toString(),
      beatmapId: id,
      hash: md5,
      rulesetId,
    };

    const Model = this.getModel(rulesetId);

    return new Model(data).toObject();
  }

  async saveOne(beatmapInfo: IJsonableBeatmapInfo, attributes: IBeatmapAttributes): Promise<BeatmapGeneral> {
    const { id, md5, mods, rulesetId } = beatmapInfo;

    const targetMods = toDifficultyMods(mods, rulesetId);

    const filter: Partial<BeatmapGeneral> = {
      mods: targetMods.toString(),
      beatmapId: id,
      hash: md5,
      rulesetId,
    };

    const data: Partial<CatchBeatmapGeneral> = {
      ...beatmapInfo,
      ...filter,
      totalHits: attributes.totalHits,
      maxFruits: attributes.maxFruits,
      maxDroplets: attributes.maxDroplets,
      maxTinyDroplets: attributes.maxTinyDroplets,
      clockRate: attributes.clockRate,
    };

    const Model = this.getModel(rulesetId);

    return Model
      .findOneAndUpdate(filter, data, { upsert: true, new: true })
      .lean()
      .exec();
  }

  private getModel(rulesetId: number): Model<any> {
    if (rulesetId === GameMode.Fruits) {
      return this.catchBeatmapGeneralModel;
    }

    return this.beatmapGeneralModel;
  }
}

import { DifficultyAttributes } from 'osu-classes';
import { GameMode, toDifficultyMods } from '@kionell/osu-pp-calculator';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Difficulty } from './models/difficulty.model';
import { OsuDifficulty } from './models/osu-difficulty.model';
import { TaikoDifficulty } from './models/taiko-difficulty.model';
import { CatchDifficulty } from './models/catch-difficulty.model';
import { ManiaDifficulty } from './models/mania-difficulty.model';

@Injectable()
export class DifficultyRepository {
  constructor(
    @InjectModel(Difficulty.name)
    private difficultyModel: Model<Difficulty>,

    @InjectModel(OsuDifficulty.name)
    private osuDifficultyModel: Model<OsuDifficulty>,

    @InjectModel(TaikoDifficulty.name)
    private taikoDifficultyModel: Model<TaikoDifficulty>,

    @InjectModel(CatchDifficulty.name)
    private catchDifficultyModel: Model<CatchDifficulty>,

    @InjectModel(ManiaDifficulty.name)
    private maniaDifficultyModel: Model<ManiaDifficulty>,
  ) {}

  async findOne(filter: Partial<Difficulty>): Promise<Difficulty | null> {
    const rulesetId = filter.rulesetId ?? GameMode.Osu;
    const mods = filter.mods ?? 'NM';

    const targetMods = toDifficultyMods(mods, rulesetId);

    return this.difficultyModel
      .findOne({ ...filter, mods: targetMods.toString() })
      .select('-beatmapId -rulesetId -mods')
      .lean()
      .exec();
  }

  async createOne(
    beatmapId: number,
    mods: string | number,
    rulesetId: number,
    hash: string,
    difficulty: DifficultyAttributes,
  ): Promise<Difficulty> {
    const targetMods = toDifficultyMods(mods, rulesetId);

    const data = {
      ...difficulty,
      mods: targetMods.toString(),
      beatmapId,
      rulesetId,
      hash,
    };

    const Model = this.getModel(rulesetId);

    return await Model.create(data).then((doc) => doc.toObject());
  }

  async saveOne(
    beatmapId: number,
    mods: string | number,
    rulesetId: number,
    hash: string,
    difficulty: DifficultyAttributes,
  ): Promise<Difficulty> {
    const targetMods = toDifficultyMods(mods, rulesetId);

    const filter: Partial<Difficulty> = {
      mods: targetMods.toString(),
      beatmapId,
      rulesetId,
      hash,
    };

    const data = { ...difficulty, ...filter };

    const Model = this.getModel(rulesetId);

    return Model
      .findOneAndUpdate(filter, data, { upsert: true, new: true })
      .exec();
  }

  private getModel(rulesetId: number): Model<any> {
    switch (rulesetId) {
      case GameMode.Osu: return this.osuDifficultyModel;
      case GameMode.Taiko: return this.taikoDifficultyModel;
      case GameMode.Fruits: return this.catchDifficultyModel;
      case GameMode.Mania: return this.maniaDifficultyModel;
    }

    return this.difficultyModel;
  }
}

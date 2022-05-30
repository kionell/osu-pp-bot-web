import { ICalculatedBeatmap, toCombination } from '@kionell/osu-pp-calculator';
import { Model, LeanDocument } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Beatmap } from '../models/beatmap.model';
import { BeatmapOptionsDto } from '../dto/beatmap-options.dto';
import { BeatmapGeneralRepository } from './beatmap-general.repository';
import { BeatmapMetadataRepository } from './beatmap-metadata.repository';
import { DifficultyRepository } from '../../difficulty/difficulty.repository';
import { PerformanceRepository } from '../../performance/performance.repository';
import { IBeatmapResponse } from '../interfaces/beatmap-response.interface';

@Injectable()
export class BeatmapRepository {
  constructor(
    @InjectModel(Beatmap.name)
    private beatmapModel: Model<Beatmap>,
    private beatmapGeneralRepository: BeatmapGeneralRepository,
    private beatmapMetadataRepository: BeatmapMetadataRepository,
    private difficultyRepository: DifficultyRepository,
    private performanceRepository: PerformanceRepository,
  ) {}

  getOriginalFilter(options: BeatmapOptionsDto): Partial<Beatmap> {
    const { beatmapId, hash } = options;

    const filter: Partial<Beatmap> = {
      isConvert: false,
    };

    if (typeof beatmapId === 'number' && beatmapId) {
      filter.id = beatmapId;
    }

    if (typeof hash === 'string' && hash) {
      filter.hash = hash;
    }

    return filter;
  }

  getFilter(options: BeatmapOptionsDto): Partial<Beatmap> {
    const { beatmapId, rulesetId, hash, mods } = options;

    if (typeof rulesetId !== 'number') {
      return this.getOriginalFilter(options);
    }

    const filter: Partial<Beatmap> = {
      rulesetId,
    };

    if (typeof beatmapId === 'number' && beatmapId) {
      filter.id = beatmapId;
    }

    if (typeof hash === 'string' && hash) {
      filter.hash = hash;
    }

    filter.mods = toCombination(mods, rulesetId).toString();

    return filter;
  }

  async findOne(filter: Partial<Beatmap>, compact = false): Promise<IBeatmapResponse | null> {
    const query = this.beatmapModel
      .findOne(filter)
      .populate(['general', 'metadata', 'difficulty']);

    if (compact) query.select('-performance');

    const found = await query.lean().exec();

    return found ? this.transformData(found) : null;
  }

  async deleteOne(filter: Partial<Beatmap>): Promise<IBeatmapResponse | null> {
    const deleted = await this.beatmapModel
      .findOneAndDelete(filter)
      .populate(['general', 'metadata', 'difficulty'])
      .lean()
      .exec();

    return deleted ? this.transformData(deleted) : null;
  }

  async saveOne(calculated: ICalculatedBeatmap, graphFileName: string | null): Promise<IBeatmapResponse> {
    const { beatmapInfo, attributes, difficulty, performance } = calculated;

    const savedBeatmapGeneral = await this.beatmapGeneralRepository
      .saveOne(beatmapInfo, attributes);

    const savedBeatmapMetadata = await this.beatmapMetadataRepository
      .saveOne(beatmapInfo);

    const savedDifficulty = await this.difficultyRepository
      .saveOne(
        beatmapInfo.id,
        beatmapInfo.mods,
        beatmapInfo.rulesetId,
        beatmapInfo.md5,
        difficulty,
      );

    const createdPerformance = performance.map((pp) => {
      return this.performanceRepository.createOne(pp, beatmapInfo.rulesetId);
    });

    const filter = {
      id: beatmapInfo.id,
      rulesetId: beatmapInfo.rulesetId,
      isConvert: beatmapInfo.isConvert,
      mods: beatmapInfo.mods,
      hash: beatmapInfo.md5,
    };

    const data = {
      ...filter,
      graphFile: graphFileName,
      general: savedBeatmapGeneral,
      metadata: savedBeatmapMetadata,
      difficulty: savedDifficulty,
      performance: createdPerformance,
    };

    const saved = await this.beatmapModel
      .findOneAndUpdate(filter, data, { upsert: true, new: true })
      .populate(['general', 'metadata', 'difficulty'])
      .lean()
      .exec();

    return this.transformData(saved);
  }

  private transformData(obj: Beatmap): LeanDocument<Beatmap> {
    const removeProps = (o: any) => {
      delete o._id; delete o.__v; delete o.__t;
    };

    removeProps(obj);
    removeProps(obj.general);
    removeProps(obj.metadata);
    removeProps(obj.difficulty);

    if (obj.performance) {
      obj.performance.forEach(removeProps);
    }

    return obj;
  }
}

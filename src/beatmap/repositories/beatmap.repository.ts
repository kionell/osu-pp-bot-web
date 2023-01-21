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

  getFilter(options: BeatmapOptionsDto): Partial<Beatmap> {
    const { beatmapId, fileURL, hash, rulesetId, mods } = options;

    const filter: Partial<Beatmap> = {};

    if (typeof rulesetId !== 'number') {
      filter.isConvert = false;
    }
    else {
      filter.rulesetId = rulesetId;
    }

    if (typeof beatmapId === 'number' && beatmapId) {
      filter.id = beatmapId;
    }

    if (typeof fileURL === 'string' && fileURL) {
      filter.fileURL = fileURL;
    }

    if (typeof hash === 'string' && hash) {
      filter.hash = hash;
    }

    filter.mods = toCombination(mods, rulesetId).toString();

    return filter;
  }

  async findOneByMD5(hash: string, compact = false): Promise<IBeatmapResponse | null> {
    return this.findOne({ hash }, compact);
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

  async createOne(calculated: ICalculatedBeatmap, graphFileName: string | null, fileURL?: string): Promise<IBeatmapResponse> {
    const { beatmapInfo, attributes, difficulty, performance } = calculated;

    const createdBeatmapGeneral = await this.beatmapGeneralRepository.createOne(
      beatmapInfo,
      attributes,
    );

    const createdBeatmapMetadata = await this.beatmapMetadataRepository.createOne(
      beatmapInfo,
    );

    const createdDifficulty = await this.difficultyRepository.createOne(
      beatmapInfo.id,
      beatmapInfo.mods,
      beatmapInfo.rulesetId,
      beatmapInfo.md5,
      difficulty,
    );

    this.removeProps(createdBeatmapGeneral);
    this.removeProps(createdBeatmapMetadata);
    this.removeProps(createdDifficulty);

    const createdPerformance = performance.map((pp) => {
      return this.performanceRepository.createOne(pp, beatmapInfo.rulesetId);
    });

    const data = {
      id: beatmapInfo.id,
      rulesetId: beatmapInfo.rulesetId,
      isConvert: beatmapInfo.isConvert,
      mods: beatmapInfo.mods,
      hash: beatmapInfo.md5,
      graphFile: graphFileName,
      performance: createdPerformance,
      fileURL,
    };

    const created = new this.beatmapModel(data).toObject();

    created.general = createdBeatmapGeneral;
    created.metadata = createdBeatmapMetadata;
    created.difficulty = createdDifficulty;

    return this.transformData(created);
  }

  async saveOne(calculated: ICalculatedBeatmap, graphFileName: string | null, fileURL?: string): Promise<IBeatmapResponse> {
    const { beatmapInfo, attributes, difficulty, performance } = calculated;

    const savedBeatmapGeneral = await this.beatmapGeneralRepository.saveOne(
      beatmapInfo,
      attributes,
    );

    const savedBeatmapMetadata = await this.beatmapMetadataRepository.saveOne(
      beatmapInfo,
    );

    const savedDifficulty = await this.difficultyRepository.saveOne(
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
      fileURL,
    };

    const saved = await this.beatmapModel
      .findOneAndUpdate(filter, data, { upsert: true, new: true })
      .populate(['general', 'metadata', 'difficulty'])
      .lean()
      .exec();

    return this.transformData(saved);
  }

  private transformData(obj: Beatmap): LeanDocument<Beatmap> {
    this.removeProps(obj);

    if (obj.general) this.removeProps(obj.general);
    if (obj.metadata) this.removeProps(obj.metadata);
    if (obj.difficulty) this.removeProps(obj.difficulty);

    if (obj.performance) {
      obj.performance.forEach(this.removeProps);
    }

    return obj;
  }

  private removeProps(obj: any): any {
    delete obj._id;
    delete obj.__v;
    delete obj.__t;
  }
}

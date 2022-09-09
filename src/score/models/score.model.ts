import mongoose from 'mongoose';
import { ScoreRank } from 'osu-classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HitStatistics, HitStatisticsSchema } from './hit-statistics.model';
import { Performance, PerformanceSchema } from '../../performance/models/performance.model';

@Schema({ autoCreate: false })
export class Score {
  @Prop({ default: 0 })
    id: number;

  @Prop({ type: String, default: 'F' })
    rank: keyof typeof ScoreRank;

  @Prop({ default: 0 })
    totalScore: number;

  @Prop({ default: 0 })
    accuracy: number;

  @Prop({ default: 0 })
    maxCombo: number;

  @Prop({ default: false })
    passed: boolean;

  @Prop({ default: false })
    perfect: boolean;

  @Prop({ default: 0 })
    rulesetId: number;

  @Prop({ required: true })
    mods: string;

  @Prop({ default: '-' })
    username: string;

  @Prop({ default: 0 })
    userId: number;

  @Prop({ default: 0, select: false })
    beatmapId: number;

  @Prop({ default: Date })
    date: Date;

  @Prop({ required: true, select: false })
    beatmapHashMD5: string;

  @Prop({ default: 0 })
    totalHits: number;

  @Prop({ type: HitStatisticsSchema, required: true })
    statistics: HitStatistics;

  @Prop({ type: PerformanceSchema, required: true })
    performance: Performance;

  @Prop({ required: true })
    graphFile: string;
}

export const ScoreSchema = SchemaFactory.createForClass(Score);

export type ScoreDocument = Score & mongoose.Document;

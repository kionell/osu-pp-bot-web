import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BeatmapMetadata } from './beatmap-metadata.model';
import { BeatmapGeneral } from './beatmap-general.model';
import { Difficulty } from '../../difficulty/models/difficulty.model';
import { Performance, PerformanceSchema } from '../../performance/models/performance.model';

@Schema()
export class Beatmap {
  @Prop({ required: true })
    id: number;

  @Prop({ required: true })
    hash: string;

  @Prop({ required: true })
    rulesetId: number;

  @Prop({ required: true })
    mods: string;

  @Prop({ default: false })
    isConvert: boolean;

  @Prop({ required: true })
    graphFile: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'BeatmapGeneral' })
    general: BeatmapGeneral;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'BeatmapMetadata' })
    metadata: BeatmapMetadata;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Difficulty' })
    difficulty: Difficulty;

  @Prop({ type: [PerformanceSchema], default: [] })
    performance: Performance[];
}

export const BeatmapSchema = SchemaFactory.createForClass(Beatmap);

BeatmapSchema.index({ hash: 1, rulesetId: 1, mods: 1 }, { unique: true });

export type BeatmapDocument = Beatmap & mongoose.Document;

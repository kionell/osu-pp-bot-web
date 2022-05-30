import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IBeatmapGeneral } from '../interfaces/beatmap-general.interface';

@Schema()
export class BeatmapGeneral implements IBeatmapGeneral {
  @Prop({ required: true, select: false })
    hash: string;

  @Prop({ required: true, select: false })
    rulesetId: number;

  @Prop({ required: true, select: false })
    mods: string;

  @Prop({ required: true, select: false })
    beatmapId: number;

  @Prop({ default: 0 })
    length: number;

  @Prop({ default: 0 })
    bpmMin: number;

  @Prop({ default: 0 })
    bpmMax: number;

  @Prop({ default: 0 })
    bpmMode: number;

  @Prop({ default: 0 })
    circleSize: number;

  @Prop({ default: 0 })
    approachRate: number;

  @Prop({ default: 0 })
    overallDifficulty: number;

  @Prop({ default: 0 })
    drainRate: number;

  @Prop({ default: 0 })
    hittable: number;

  @Prop({ default: 0 })
    slidable: number;

  @Prop({ default: 0 })
    spinnable: number;

  @Prop({ default: 0 })
    holdable: number;

  @Prop({ default: 0 })
    maxCombo: number;

  @Prop({ default: 0 })
    totalHits: number;
}

export const BeatmapGeneralSchema = SchemaFactory.createForClass(BeatmapGeneral);

BeatmapGeneralSchema.index({ hash: 1, rulesetId: 1, mods: 1 }, { unique: true });

export type BeatmapGeneralDocument = BeatmapGeneral & mongoose.Document;

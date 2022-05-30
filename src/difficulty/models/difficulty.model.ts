import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Difficulty {
  @Prop({ required: true, select: false })
    hash: string;

  @Prop({ required: true, select: false })
    beatmapId: number;

  @Prop({ required: true, select: false })
    rulesetId: number;

  @Prop({ required: true })
    mods: string;

  @Prop({ required: true })
    starRating: number;

  @Prop({ required: true })
    maxCombo: number;
}

export const DifficultySchema = SchemaFactory.createForClass(Difficulty);

DifficultySchema.index({ hash: 1, rulesetId: 1, mods: 1 }, { unique: true });

export type DifficultyDocument = Difficulty & Document;

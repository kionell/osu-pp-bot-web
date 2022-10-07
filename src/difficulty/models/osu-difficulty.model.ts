import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Difficulty } from './difficulty.model';

@Schema()
export class OsuDifficulty extends Difficulty {
  @Prop({ default: 0 })
    aimDifficulty: number;

  @Prop({ default: 0 })
    speedDifficulty: number;

  @Prop({ default: 0 })
    speedNoteCount: number;

  @Prop({ default: 0 })
    flashlightDifficulty: number;

  @Prop({ default: 0 })
    sliderFactor: number;

  @Prop({ default: 0 })
    approachRate: number;

  @Prop({ default: 0 })
    overallDifficulty: number;

  @Prop({ default: 0 })
    drainRate: number;

  @Prop({ default: 0 })
    hitCircleCount: number;

  @Prop({ default: 0 })
    sliderCount: number;

  @Prop({ default: 0 })
    spinnerCount: number;
}

export const OsuDifficultySchema = SchemaFactory.createForClass(OsuDifficulty);

export type OsuDifficultyDocument = OsuDifficulty & Document;

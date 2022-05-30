import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Difficulty } from './difficulty.model';

@Schema()
export class OsuDifficulty extends Difficulty {
  @Prop({ default: 0 })
    aimStrain: number;

  @Prop({ default: 0 })
    speedStrain: number;

  @Prop({ default: 0 })
    flashlightRating: number;

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

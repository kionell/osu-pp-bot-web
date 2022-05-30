import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Difficulty } from './difficulty.model';

@Schema()
export class TaikoDifficulty extends Difficulty {
  @Prop({ default: 0 })
    staminaStrain: number;

  @Prop({ default: 0 })
    rhythmStrain: number;

  @Prop({ default: 0 })
    colourStrain: number;

  @Prop({ default: 0 })
    approachRate: number;

  @Prop({ default: 0 })
    greatHitWindow: number;
}

export const TaikoDifficultySchema = SchemaFactory.createForClass(TaikoDifficulty);

export type TaikoDifficultyDocument = TaikoDifficulty & Document;

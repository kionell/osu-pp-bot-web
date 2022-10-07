import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Difficulty } from './difficulty.model';

@Schema()
export class TaikoDifficulty extends Difficulty {
  @Prop({ default: 0 })
    staminaDifficulty: number;

  @Prop({ default: 0 })
    rhythmDifficulty: number;

  @Prop({ default: 0 })
    colourDifficulty: number;

  @Prop({ default: 0 })
    peakDifficulty: number;

  @Prop({ default: 0 })
    greatHitWindow: number;
}

export const TaikoDifficultySchema = SchemaFactory.createForClass(TaikoDifficulty);

export type TaikoDifficultyDocument = TaikoDifficulty & Document;

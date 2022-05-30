import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Difficulty } from './difficulty.model';

@Schema()
export class ManiaDifficulty extends Difficulty {
  @Prop({ default: 0 })
    greatHitWindow: number;

  @Prop({ default: 0 })
    scoreMultiplier: number;
}

export const ManiaDifficultySchema = SchemaFactory.createForClass(ManiaDifficulty);

export type ManiaDifficultyDocument = ManiaDifficulty & Document;

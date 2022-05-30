import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Difficulty } from './difficulty.model';

@Schema()
export class CatchDifficulty extends Difficulty {
  @Prop({ default: 0 })
    approachRate: number;
}

export const CatchDifficultySchema = SchemaFactory.createForClass(CatchDifficulty);

export type CatchDifficultyDocument = CatchDifficulty & Document;

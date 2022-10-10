import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Performance } from './performance.model';

@Schema()
export class ManiaPerformance extends Performance {
  @Prop({ default: 0 })
    difficultyPerformance: number;
}

export const ManiaPerformanceSchema = SchemaFactory.createForClass(ManiaPerformance);

export type ManiaPerformanceDocument = ManiaPerformance & Document;

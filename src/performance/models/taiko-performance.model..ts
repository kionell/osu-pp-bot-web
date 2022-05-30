import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Performance } from './performance.model';

@Schema()
export class TaikoPerformance extends Performance {
  @Prop({ default: 0 })
    strainPerformance: number;

  @Prop({ default: 0 })
    accuracyPerformance: number;
}

export const TaikoPerformanceSchema = SchemaFactory.createForClass(TaikoPerformance);

export type TaikoPerformanceDocument = TaikoPerformance & Document;

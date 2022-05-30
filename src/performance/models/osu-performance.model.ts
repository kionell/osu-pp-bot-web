import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Performance } from './performance.model';

@Schema()
export class OsuPerformance extends Performance {
  @Prop({ default: 0 })
    aimPerformance: number;

  @Prop({ default: 0 })
    speedPerformance: number;

  @Prop({ default: 0 })
    accuracyPerformance: number;

  @Prop({ default: 0 })
    flashlightPerformance: number;

  @Prop({ default: 0 })
    effectiveMissCount: number;
}

export const OsuPerformanceSchema = SchemaFactory.createForClass(OsuPerformance);

export type OsuPerformanceDocument = OsuPerformance & Document;

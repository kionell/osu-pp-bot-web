import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ autoCreate: false, _id: false })
export class Performance {
  @Prop({ required: true })
    mods: string;

  @Prop({ required: true })
    totalPerformance: number;
}

export const PerformanceSchema = SchemaFactory.createForClass(Performance);

export type PerformanceDocument = Performance & Document;

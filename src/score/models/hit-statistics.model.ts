import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ autoCreate: false })
export class HitStatistics {
  @Prop({ default: 0 })
    countGeki: number;

  @Prop({ default: 0 })
    count300: number;

  @Prop({ default: 0 })
    countKatu: number;

  @Prop({ default: 0 })
    count100: number;

  @Prop({ default: 0 })
    count50: number;

  @Prop({ default: 0 })
    countMiss: number;
}

export const HitStatisticsSchema = SchemaFactory.createForClass(HitStatistics);

export type HitStatisticsDocument = HitStatistics & mongoose.Document;

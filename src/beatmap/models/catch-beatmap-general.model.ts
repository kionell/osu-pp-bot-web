import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BeatmapGeneral } from './beatmap-general.model';

@Schema()
export class CatchBeatmapGeneral extends BeatmapGeneral {
  @Prop({ default: 0 })
    maxFruits: number;

  @Prop({ default: 0 })
    maxDroplets: number;

  @Prop({ default: 0 })
    maxTinyDroplets: number;
}

export const CatchBeatmapGeneralSchema = SchemaFactory.createForClass(CatchBeatmapGeneral);

export type CatchBeatmapGeneralDocument = CatchBeatmapGeneral & mongoose.Document;

import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IBeatmapMetadata } from '../interfaces/beatmap-metadata.interface';

@Schema()
export class BeatmapMetadata implements IBeatmapMetadata {
  @Prop({ required: true, select: false })
    hash: string;

  @Prop({ required: true, select: false })
    beatmapId: number;

  @Prop({ required: true })
    beatmapsetId: number;

  @Prop({ required: true })
    creatorId: number;

  @Prop({ required: true })
    creator: string;

  @Prop({ default: '' })
    title: string;

  @Prop({ default: '' })
    artist: string;

  @Prop({ default: '' })
    version: string;
}

export const BeatmapMetadataSchema = SchemaFactory.createForClass(BeatmapMetadata);

BeatmapMetadataSchema.index({ hash: 1 }, { unique: true });

export type BeatmapMetadataDocument = BeatmapMetadata & mongoose.Document;

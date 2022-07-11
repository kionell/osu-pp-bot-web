import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ autoCreate: false, _id: false })
export class URLConfig {
  @Prop({ type: Boolean, default: true })
    parseBeatmap: boolean;

  @Prop({ type: Boolean, default: true })
    parseScore: boolean;

  @Prop({ type: Boolean, default: true })
    parseUser: boolean;
}

export const URLConfigSchema = SchemaFactory.createForClass(URLConfig);

export type URLConfigDocument = URLConfig & mongoose.Document;

import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ autoCreate: false, _id: false })
export class FileConfig {
  @Prop({ type: Boolean, default: true })
    parseBeatmap: boolean;

  @Prop({ type: Boolean, default: true })
    parseReplay: boolean;
}

export const FileConfigSchema = SchemaFactory.createForClass(FileConfig);

export type FileConfigDocument = FileConfig & mongoose.Document;

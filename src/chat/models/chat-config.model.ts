import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { URLConfig } from './url-config.model';
import { FileConfig } from './file-config.model';

@Schema({ autoCreate: false, _id: false })
export class ChatConfig {
  @Prop({ type: String || null, default: null })
    prefix: string | null;

  @Prop({ type: String || null, default: null })
    flagShortPrefix: string | null;

  @Prop({ type: String || null, default: null })
    flagFullPrefix: string | null;

  @Prop({ type: String || null, default: null })
    flagSuffix: string | null;

  @Prop({ type: URLConfig, required: true })
    url: URLConfig;

  @Prop({ type: FileConfig, required: true })
    file: FileConfig;
}

export const ChatConfigSchema = SchemaFactory.createForClass(ChatConfig);

export type ChatConfigDocument = ChatConfig & mongoose.Document;

import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Server } from './server.model';
import { ChatConfig } from './chat-config.model';

@Schema()
export class Channel {
  @Prop({ required: true })
    id: string;

  @Prop({ default: 0 })
    beatmapId: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Server', default: null })
    server: Server | null;

  @Prop({ type: ChatConfig, required: true })
    config: ChatConfig;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);

export type ChannelDocument = Channel & mongoose.Document;

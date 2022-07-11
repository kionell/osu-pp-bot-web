import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ChatConfig } from './chat-config.model';

@Schema()
export class Server {
  @Prop({ required: true })
    id: string;

  @Prop({ type: ChatConfig, required: true })
    config: ChatConfig;
}

export const ServerSchema = SchemaFactory.createForClass(Server);

export type ServerDocument = Server & mongoose.Document;

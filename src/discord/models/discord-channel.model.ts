import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DiscordServer } from './discord-server.model';

@Schema()
export class DiscordChannel {
  @Prop({ required: true })
    id: string;

  @Prop({ default: 0 })
    beatmapId: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'DiscordServer', default: null })
    server: DiscordServer | null;
}

export const DiscordChannelSchema = SchemaFactory.createForClass(DiscordChannel);

export type DiscordChannelDocument = DiscordChannel & mongoose.Document;

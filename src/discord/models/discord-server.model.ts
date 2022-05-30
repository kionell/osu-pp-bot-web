import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class DiscordServer {
  @Prop({ required: true })
    id: string;

  @Prop({ type: String || null, default: null })
    prefix: string | null;
}

export const DiscordServerSchema = SchemaFactory.createForClass(DiscordServer);

export type DiscordServerDocument = DiscordServer & mongoose.Document;

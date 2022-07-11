import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Server {
  @Prop({ required: true })
    id: string;

  @Prop({ type: String || null, default: null })
    prefix: string | null;
}

export const ServerSchema = SchemaFactory.createForClass(Server);

export type ServerDocument = Server & mongoose.Document;

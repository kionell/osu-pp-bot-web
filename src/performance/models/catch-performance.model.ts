import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Performance } from './performance.model';

@Schema()
export class CatchPerformance extends Performance {}

export const CatchPerformanceSchema = SchemaFactory.createForClass(CatchPerformance);

export type CatchPerformanceDocument = CatchPerformance & Document;

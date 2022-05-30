import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BeatmapModule } from './beatmap/beatmap.module';
import { ScoreModule } from './score/score.module';
import { ApiModule } from './api/api.module';
import { VisualizerModule } from './visualizer/visualizer.module';
import { DiscordModule } from './discord/discord.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO as string),
    BeatmapModule,
    ScoreModule,
    ApiModule,
    VisualizerModule,
    DiscordModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DifficultyRepository } from './difficulty.repository';
import { Difficulty, DifficultySchema } from './models/difficulty.model';
import { OsuDifficulty, OsuDifficultySchema } from './models/osu-difficulty.model';
import { TaikoDifficulty, TaikoDifficultySchema } from './models/taiko-difficulty.model';
import { CatchDifficulty, CatchDifficultySchema } from './models/catch-difficulty.model';
import { ManiaDifficulty, ManiaDifficultySchema } from './models/mania-difficulty.model';

@Module({
  providers: [DifficultyRepository],
  exports: [DifficultyRepository, MongooseModule],
  imports: [
    MongooseModule.forFeature([
      {
        name: Difficulty.name,
        schema: DifficultySchema,
        discriminators: [
          {
            name: OsuDifficulty.name,
            schema: OsuDifficultySchema,
          },
          {
            name: TaikoDifficulty.name,
            schema: TaikoDifficultySchema,
          },
          {
            name: CatchDifficulty.name,
            schema: CatchDifficultySchema,
          },
          {
            name: ManiaDifficulty.name,
            schema: ManiaDifficultySchema,
          },
        ],
      },
    ]),
  ],
})
export class DifficultyModule {}

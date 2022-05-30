import { BeatmapInfo, IBeatmapInfo } from 'osu-classes';
import { Injectable } from '@nestjs/common';
import { IBeatmapAttributes } from '@kionell/osu-pp-calculator';
import { CatchBeatmapGeneral } from '../models/catch-beatmap-general.model';
import { IBeatmapResponse } from '../interfaces/beatmap-response.interface';

/**
 * Beatmap data conversion utils
 */
@Injectable()
export class ConversionUtils {
  /**
   * Converts combined beatmap data to beatmap information.
   * @param beatmap Beatmap data.
   * @returns Converted beatmap information.
   */
  createBeatmapInfo(beatmap: IBeatmapResponse): IBeatmapInfo {
    const beatmapInfo = new BeatmapInfo({
      id: beatmap.id,
      beatmapsetId: beatmap.metadata.beatmapsetId,
      creatorId: beatmap.metadata.creatorId,
      creator: beatmap.metadata.creator,
      title: beatmap.metadata.title,
      artist: beatmap.metadata.artist,
      version: beatmap.metadata.version,
      hittable: beatmap.general.hittable,
      slidable: beatmap.general.slidable,
      spinnable: beatmap.general.spinnable,
      holdable: beatmap.general.holdable,
      length: beatmap.general.length,
      bpmMin: beatmap.general.bpmMin,
      bpmMax: beatmap.general.bpmMax,
      bpmMode: beatmap.general.bpmMode,
      circleSize: beatmap.general.circleSize,
      approachRate: beatmap.general.approachRate,
      overallDifficulty: beatmap.general.overallDifficulty,
      drainRate: beatmap.general.drainRate,
      maxCombo: beatmap.general.maxCombo,
      isConvert: beatmap.isConvert,
      md5: beatmap.hash,
    });

    beatmapInfo.rulesetId = beatmap.rulesetId;
    beatmapInfo.rawMods = beatmap.mods;

    return beatmapInfo;
  }

  /**
   * Converts combined beatmap data to beatmap attributes.
   * @param beatmap Beatmap data.
   * @returns Converted beatmap attributes.
   */
  createBeatmapAttributes(beatmap: IBeatmapResponse): IBeatmapAttributes {
    const catchGeneral = beatmap.general as CatchBeatmapGeneral;

    return {
      beatmapId: beatmap.id,
      hash: beatmap.hash,
      rulesetId: beatmap.rulesetId,
      mods: beatmap.mods,
      totalHits: beatmap.general.totalHits,
      maxCombo: beatmap.general.maxCombo,
      maxFruits: catchGeneral?.maxFruits ?? 0,
      maxDroplets: catchGeneral?.maxDroplets ?? 0,
      maxTinyDroplets: catchGeneral?.maxTinyDroplets ?? 0,
    };
  }
}

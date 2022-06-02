import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IBeatmapRequestOptions } from '@kionell/osu-api';
import { downloadFile, parseScore } from '@kionell/osu-pp-calculator';
import { DownloadResult, DownloadType, IDownloadEntryOptions } from 'osu-downloader';
import { ApiService } from '../api.service';
import { BeatmapOptionsDto } from '../../beatmap/dto/beatmap-options.dto';
import { ScoreOptionsDto } from '../../score/dto/score-options.dto';

/**
 * Downloading utils.
 */
@Injectable()
export class DownloadUtils {
  constructor(private apiService: ApiService) {}

  /**
   * Tries to download beatmap file.
   * @param options Beatmap options.
   * @throws If beatmap failed to download.
   * @returns Beatmap download result.
   */
  async downloadBeatmap(options: BeatmapOptionsDto): Promise<DownloadResult> {
    const savePath = process.env.CACHE_PATH as string;
    const targetBeatmap = await this.getTargetBeatmapOrFail(options);

    const downloadOptions: IDownloadEntryOptions = {
      type: DownloadType.Beatmap,
    };

    if (typeof options.hash === 'string' && options.hash) {
      downloadOptions.customName = options.hash;
    }

    if (typeof targetBeatmap === 'number' && targetBeatmap) {
      downloadOptions.id = targetBeatmap;
    }

    if (typeof targetBeatmap === 'string' && targetBeatmap) {
      downloadOptions.url = targetBeatmap;
    }

    return await downloadFile(savePath, downloadOptions);
  }

  /**
   * Tries to download replay file.
   * @param options Score options.
   * @throws If replay failed to download.
   * @returns Replay download result.
   */
  async downloadReplay(options: ScoreOptionsDto): Promise<DownloadResult> {
    const savePath = process.env.CACHE_PATH as string;

    return await downloadFile(savePath, {
      url: options.replayURL,
      type: DownloadType.Replay,
    });
  }

  /**
   * Tries to get beatmap ID or file URL from options.
   * If there are no ID or URL, try to search beatmap via server API. 
   * @param options Beatmap options.
   * @throws If it's impossible to get beatmap ID or beatmap file URL.
   * @returns Beatmap ID or beatmap file URL.
   */
  private async getTargetBeatmapOrFail(options: BeatmapOptionsDto): Promise<number | string> {
    const { beatmapId, hash, search, fileURL, replayURL } = options;

    if (typeof beatmapId === 'number') return beatmapId;
    if (typeof fileURL === 'string') return fileURL;

    if (!hash && !search && !replayURL) {
      throw new InternalServerErrorException('Beatmap not found!');
    }

    return this.searchTargetBeatmap(options);
  }

  /**
   * Try to search for a beatmap by its hash or search query.
   * If there are no hash or search query then try to get hash from replay file.
   * @param options Beatmap options.
   * @returns Beatmap ID.
   */
  private async searchTargetBeatmap(options: BeatmapOptionsDto): Promise<number> {
    const { search, server } = options;

    const hash = await this.getBeatmapMD5OrNull(options);

    const requestOptions: IBeatmapRequestOptions = {};

    if (typeof search === 'string') requestOptions.search = search;
    if (typeof hash === 'string') requestOptions.hash = hash;

    const beatmapInfo = await this.apiService.getBeatmap(server, requestOptions);

    if (!beatmapInfo?.id) {
      throw new InternalServerErrorException('Beatmap not found!');
    }

    options.beatmapId ??= beatmapInfo.id;
    options.rulesetId ??= beatmapInfo.rulesetId;

    if (!options.hash && beatmapInfo.md5) {
      options.hash = beatmapInfo.md5;
    }

    return options.beatmapId;
  }

  /**
   * If hash is present in beatmap options then returns it.
   * Otherwise parses replay file to get beatmap MD5.
   * @param options Beatmap options.
   * @throws If replay file failed to downlaod.
   * @returns Beatmap MD5 hash or null.
   */
  private async getBeatmapMD5OrNull(options: BeatmapOptionsDto): Promise<string | null> {
    const { hash, replayURL } = options;

    if (typeof hash === 'string') return hash;
    if (typeof replayURL !== 'string') return null;

    const score = await parseScore({
      savePath: process.env.CACHE_PATH,
      replayURL,
    });

    const scoreInfo = score.data.info;

    options.mods = scoreInfo.rawMods;

    return scoreInfo.beatmapHashMD5;
  }
}

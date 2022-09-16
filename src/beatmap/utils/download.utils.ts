import { downloadFile } from '@kionell/osu-pp-calculator';
import { DownloadType, IDownloadEntryOptions } from 'osu-downloader';
import { BeatmapOptionsDto } from '../dto/beatmap-options.dto';

/**
 * Tries to download beatmap file.
 * @param options Beatmap options.
 * @throws If beatmap failed to download.
 * @returns Beatmap download result.
 */
export async function downloadBeatmap(options: BeatmapOptionsDto): ReturnType<typeof downloadFile> {
  const savePath = process.env.CACHE_PATH as string;

  const downloadOptions: IDownloadEntryOptions = {
    type: DownloadType.Beatmap,
  };

  if (typeof options.hash === 'string' && options.hash) {
    downloadOptions.customName = options.hash;
  }

  if (typeof options.beatmapId === 'number' && options.beatmapId) {
    downloadOptions.id = options.beatmapId;
  }

  if (typeof options.fileURL === 'string' && options.fileURL) {
    downloadOptions.url = options.fileURL;
  }

  return await downloadFile(savePath, downloadOptions);
}

import { downloadFile } from '@kionell/osu-pp-calculator';
import { InternalServerErrorException } from '@nestjs/common';
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

  const result = await downloadFile(savePath, downloadOptions);

  console.log(`Beatmap (${result.id || result.url}) download with status: "${result.statusText}"`);

  if (!result.isSuccessful) {
    const error = result.statusText === 'File is empty' ? 'Not found' : result.statusText;

    throw new InternalServerErrorException(`Failed to download beatmap file: ${error}`);
  }

  if (!result.md5) {
    throw new InternalServerErrorException('Failed to get MD5 checksum of downloaded file!');
  }

  return result;
}

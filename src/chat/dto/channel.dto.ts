import { ChatConfigDto } from './configs/chat-config.dto';
import { ServerDto } from './server.dto';

/**
 * Channel data.
 */
export class ChannelDto {
  /**
   * Channel ID.
   */
  id: string | number;

  /**
   * Last saved beatmap ID.
   */
  beatmapId: number | null;

  /**
   * Last saved beatmap MD5 hash.
   */
  beatmapMD5: string | null;

  /**
   * Nested server data.
   */
  server?: ServerDto | null;

  /**
   * Channel config.
   */
  config?: ChatConfigDto;
}

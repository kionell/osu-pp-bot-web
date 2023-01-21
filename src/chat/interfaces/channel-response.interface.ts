import { IChatConfigResponse } from './chat-config-response.interface';
import { IServerResponse } from './server-response.interface';

/**
 * A channel response.
 */
export interface IChannelResponse {
  /**
   * Channel ID.
   */
  id: string;

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
  server: IServerResponse | null;

  /**
   * Channel config.
   */
  config: IChatConfigResponse;
}

import { IFileConfigResponse } from './file-config-response.interface';
import { IURLConfigResponse } from './url-config-response.interface';

/**
 * Config data that will be used for channel or server.
 * Channel configs have more priority over server configs.
 */
export interface IChatConfigResponse {
  /**
   * Custom prefix that will be used on this server.
   */
  prefix: string | null;

  /**
   * Custom flag short prefix that will be used on this server.
   */
  flagShortPrefix: string | null;

  /**
   * Custom flag full prefix that will be used on this server.
   */
  flagFullPrefix: string | null;

  /**
   * Custom flag suffix that will be used on this server.
   */
  flagSuffix: string | null;

  /**
   * URL parsing config.
   */
  url: IURLConfigResponse;

  /**
   * File parsing config.
   */
  file: IFileConfigResponse;
}

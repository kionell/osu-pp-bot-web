import { FileConfigDto } from './file-config.dto';
import { URLConfigDto } from './url-config.dto';

/**
 * Config data that will be used for channel or server.
 * Channel configs have more priority over server configs.
 */
export class ChatConfigDto {
  /**
   * Custom prefix that will be used on this server.
   */
  prefix?: string | null;

  /**
   * Custom flag short prefix that will be used on this server.
   */
  flagShortPrefix?: string | null;

  /**
   * Custom flag full prefix that will be used on this server.
   */
  flagFullPrefix?: string | null;

  /**
   * Custom flag suffix that will be used on this server.
   */
  flagSuffix?: string | null;

  /**
   * URL parsing config.
   */
  url?: URLConfigDto;

  /**
   * File parsing config.
   */
  file?: FileConfigDto;
}

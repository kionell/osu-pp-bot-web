/**
 * Discord server data.
 */
export class DiscordServerDto {
  /**
   * Discord server ID.
   */
  id: string | number;

  /**
   * Custom prefix that will be used on this server.
   */
  prefix?: string | null;
}

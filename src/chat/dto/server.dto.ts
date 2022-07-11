import { ChatConfigDto } from './configs/chat-config.dto';

/**
 * Server data.
 */
export class ServerDto {
  /**
   * Server ID.
   */
  id: string | number;

  /**
   * Server config.
   */
  config?: ChatConfigDto;
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Channel, ChannelSchema } from './models/channel.model';
import { Server, ServerSchema } from './models/server.model';
import { ChannelRepository } from './repositories/channel.repository';
import { ServerRepository } from './repositories/server.repository';

@Module({
  controllers: [ChatController],
  providers: [
    ChatService,
    ChannelRepository,
    ServerRepository,
  ],
  imports: [
    MongooseModule.forFeature([
      {
        name: Channel.name,
        schema: ChannelSchema,
      },
      {
        name: Server.name,
        schema: ServerSchema,
      },
    ]),
  ],
})
export class ChatModule {}

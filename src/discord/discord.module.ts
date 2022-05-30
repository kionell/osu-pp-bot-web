import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscordService } from './discord.service';
import { DiscordController } from './discord.controller';
import { DiscordChannel, DiscordChannelSchema } from './models/discord-channel.model';
import { DiscordServer, DiscordServerSchema } from './models/discord-server.model';
import { DiscordChannelRepository } from './repositories/discord-channel.repository';
import { DiscordServerRepository } from './repositories/discord-server.repository';

@Module({
  controllers: [DiscordController],
  providers: [
    DiscordService,
    DiscordChannelRepository,
    DiscordServerRepository,
  ],
  imports: [
    MongooseModule.forFeature([
      {
        name: DiscordChannel.name,
        schema: DiscordChannelSchema,
      },
      {
        name: DiscordServer.name,
        schema: DiscordServerSchema,
      },
    ]),
  ],
})
export class DiscordModule {}

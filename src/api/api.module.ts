import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { DownloadUtils } from './utils/download.util';

@Module({
  providers: [
    ApiService,
    DownloadUtils,
  ],
  exports: [
    ApiService,
    DownloadUtils,
  ],
})
export class ApiModule {}

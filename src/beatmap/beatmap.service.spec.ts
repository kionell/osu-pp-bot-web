import { Test, TestingModule } from '@nestjs/testing';
import { BeatmapService } from './beatmap.service';

describe('BeatmapService', () => {
  let service: BeatmapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BeatmapService],
    }).compile();

    service = module.get<BeatmapService>(BeatmapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

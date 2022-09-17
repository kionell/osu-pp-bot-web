import { Test, TestingModule } from '@nestjs/testing';
import { BeatmapService } from './beatmap.service';

describe('Beatmap Service', async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [BeatmapService],
  }).compile();

  const service = module.get<BeatmapService>(BeatmapService);

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should calculate beatmap its ID', async () => {
    const response = await service.processBeatmap({
      beatmapId: 91,
    });

    expect(response.id).toBe(91);
    expect(response.graphFile).not.toBeUndefined();
    expect(response).toHaveProperty('performance');
  });

  it('Should automatically detect ruleset ID', async () => {
    const response = await service.processBeatmap({
      beatmapId: 3734591,
    });

    expect(response.id).toBe(3734591);
    expect(response.rulesetId).toBe(2);
    expect(response.graphFile).not.toBeUndefined();
    expect(response).toHaveProperty('performance');
  });

  it('Should convert beatmaps properly', async () => {
    const response = await service.processBeatmap({
      beatmapId: 3764203,
      rulesetId: 1,
    });

    expect(response.id).toBe(3734591);
    expect(response.rulesetId).toBe(1);
    expect(response.isConvert).toBeTruthy();
    expect(response.graphFile).not.toBeUndefined();
    expect(response).toHaveProperty('performance');
  });

  it('Should calculate unsubmitted beatmaps', async () => {
    const response = await service.processBeatmap({
      fileURL: 'https://cdn.discordapp.com/attachments/868939792077951076/1020122684643889212/1.osu',
    });

    expect(response.metadata.title).toBe('Rise of the Chaos Wizards');
    expect(response.rulesetId).toBe(0);
    expect(response.graphFile).not.toBeUndefined();
    expect(response).toHaveProperty('performance');
  });

  it('Should apply mods correctly', async () => {
    const response = await service.processBeatmap({
      beatmapId: 3613161,
      mods: 16,
    });

    expect(response.rulesetId).toBe(0);
    expect(response.mods).toBe('HR');
    expect(response.graphFile).not.toBeUndefined();
    expect(response).toHaveProperty('performance');
  });

  it('Should not return performance for compact mode', async () => {
    const response = await service.processBeatmap({
      beatmapId: 3715079,
    }, true);

    expect(response.graphFile).not.toBeUndefined();
    expect(response).toHaveProperty('performance');
  });

  it('Should not return performance for compact mode', async () => {
    const response = await service.processBeatmap({
      beatmapId: 3715079,
    }, true);

    expect(response.graphFile).not.toBeUndefined();
    expect(response).not.toHaveProperty('performance');
  });

  it('Should calculate beatmap by replay file on submitted beatmap', async () => {
    const response = await service.processBeatmap({
      replayURL: 'https://cdn.discordapp.com/attachments/868939792077951076/1020430323684753469/Kionell_-_BLUE_ENCOUNT_-_HOPE_SURVIVOR_2022-09-04_Osu.osr',
    });

    expect(response.metadata.title).toBe('HOPE');
    expect(response.metadata.version).toBe('SURVIVOR');
    expect(response.graphFile).not.toBeUndefined();
    expect(response).toHaveProperty('performance');
  });

  it('Should calculate beatmap by MD5 hash on submitted beatmap', async () => {
    const response = await service.processBeatmap({
      hash: '9cde906db1356b76c0aa689bd3e88994',
    });

    expect(response.id).toBe(3721898);
    expect(response.rulesetId).toBe(3);
    expect(response.metadata.title).toBe('MirroR');
    expect(response.metadata.artist).toBe('dj-B');
    expect(response.graphFile).not.toBeUndefined();
    expect(response).toHaveProperty('performance');
  });

  it('Should calculate beatmap by search query', async () => {
    const response = await service.processBeatmap({
      search: 'freedom dive',
    });

    expect(response.id).toBe(126645);
    expect(response.rulesetId).toBe(0);
    expect(response.metadata.title).toBe('FREEDOM DiVE');
    expect(response.metadata.artist).toBe('xi');
    expect(response.graphFile).not.toBeUndefined();
    expect(response).toHaveProperty('performance');
  });

  it('Should throw error if there are not enough data', async () => {
    const response = service.processBeatmap({
      rulesetId: 0,
    });

    await expect(response).rejects.toThrowError('Not enough data to get a beatmap!');
  });

  it('Should throw error if all values are falsy', async () => {
    const response = service.processBeatmap({
      rulesetId: 0,
      beatmapId: 0,
      fileURL: '',
      hash: '',
      replayURL: '',
    });

    await expect(response).rejects.toThrowError('Not enough data to get a beatmap!');
  });

  it('Should throw error on non existing beatmap ID', async () => {
    const response = service.processBeatmap({
      beatmapId: 1337,
    });

    await expect(response).rejects.toThrow();
  });

  it('Should throw error on fake beatmap file URL', async () => {
    const response = service.processBeatmap({
      fileURL: 'https://osu.ppy.sh/users/9628870',
    });

    await expect(response).rejects.toThrow();
  });

  it('Should throw error on fake replay URL', async () => {
    const response = service.processBeatmap({
      replayURL: 'https://osu.ppy.sh/users/9628870',
    });

    await expect(response).rejects.toThrow();
  });

  it('Should throw error when beatmap MD5 & replay beatmap MD5 don\'t match', async () => {
    const response = service.processBeatmap({
      fileURL: 'https://cdn.discordapp.com/attachments/484409485436256256/1020662290208530442/2.osu',
      replayURL: 'https://cdn.discordapp.com/attachments/484409485436256256/1020662289877172304/1.osr',
    });

    await expect(response).rejects.toThrow();
  });
});

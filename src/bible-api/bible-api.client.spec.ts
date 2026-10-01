import {
  BadGatewayException,
  GatewayTimeoutException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BibleApiClient } from './bible-api.client';

describe('BibleApiClient', () => {
  let client: BibleApiClient;
  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    const config = new ConfigService({
      BIBLE_API_BASE_URL: 'https://bible.example/api/',
      BIBLE_API_TIMEOUT_MS: '1000',
    });
    client = new BibleApiClient(config);
    fetchMock = jest.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    fetchMock.mockRestore();
  });

  it('builds the chapter URL and returns the parsed JSON', async () => {
    fetchMock.mockResolvedValue(Response.json({ numberOfVerses: 31 }));

    await expect(client.getChapter('spa_r09', 'GEN', 1)).resolves.toEqual({
      numberOfVerses: 31,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://bible.example/api/spa_r09/GEN/1.json',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it('maps a 404 to NotFoundException', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 404 }));

    await expect(client.getBooks('nope')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('maps other error statuses to BadGatewayException', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 503 }));

    await expect(client.getTranslations()).rejects.toBeInstanceOf(
      BadGatewayException,
    );
  });

  it('maps a timeout to GatewayTimeoutException', async () => {
    fetchMock.mockRejectedValue(
      new DOMException('The operation timed out.', 'TimeoutError'),
    );

    await expect(client.getTranslations()).rejects.toBeInstanceOf(
      GatewayTimeoutException,
    );
  });

  it('maps network failures to BadGatewayException', async () => {
    fetchMock.mockRejectedValue(new TypeError('fetch failed'));

    await expect(client.getTranslations()).rejects.toBeInstanceOf(
      BadGatewayException,
    );
  });
});

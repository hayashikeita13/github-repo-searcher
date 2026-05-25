import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getRepository } from './getRepository';
import { GithubApiError } from './types';

const validRepository = {
  id: 1,
  name: 'next.js',
  full_name: 'vercel/next.js',
  owner: { login: 'vercel', avatar_url: 'https://avatars.githubusercontent.com/u/14985020?v=4' },
  html_url: 'https://github.com/vercel/next.js',
  language: 'JavaScript',
  stargazers_count: 100,
  watchers_count: 50,
  forks_count: 25,
  open_issues_count: 10,
};

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
}

describe('getRepository', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('owner/name を含む URL で fetch を呼ぶ', async () => {
    const fetchMock = vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(validRepository));

    await getRepository({ owner: 'vercel', name: 'next.js' });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toBe('https://api.github.com/repos/vercel/next.js');
  });

  it('正常レスポンスをそのまま返す', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(validRepository));

    const result = await getRepository({ owner: 'vercel', name: 'next.js' });

    expect(result.full_name).toBe('vercel/next.js');
    expect(result.stargazers_count).toBe(100);
  });

  it('空 owner で validation エラーを throw（fetch は呼ばれない）', async () => {
    const fetchMock = vi.mocked(fetch);

    await expect(getRepository({ owner: '', name: 'next.js' })).rejects.toMatchObject({
      kind: 'validation',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('空 name で validation エラーを throw', async () => {
    await expect(getRepository({ owner: 'vercel', name: '' })).rejects.toBeInstanceOf(GithubApiError);
  });

  it('レスポンスが schema に違反したら kind="unknown" を throw', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ bogus: true }));

    await expect(getRepository({ owner: 'vercel', name: 'next.js' })).rejects.toMatchObject({
      kind: 'unknown',
    });
  });

  it('404 で kind="not_found"', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ message: 'Not Found' }, { status: 404 }));

    await expect(getRepository({ owner: 'vercel', name: 'nonexistent' })).rejects.toMatchObject({
      kind: 'not_found',
    });
  });

  it('403 + X-RateLimit-Remaining: 0 で kind="rate_limit"', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ message: 'rate limit exceeded' }, { status: 403, headers: { 'X-RateLimit-Remaining': '0' } })
    );

    await expect(getRepository({ owner: 'vercel', name: 'next.js' })).rejects.toMatchObject({
      kind: 'rate_limit',
    });
  });

  it('403 で X-RateLimit-Remaining > 0 なら kind="forbidden"', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ message: 'forbidden' }, { status: 403, headers: { 'X-RateLimit-Remaining': '10' } })
    );

    await expect(getRepository({ owner: 'vercel', name: 'next.js' })).rejects.toMatchObject({
      kind: 'forbidden',
    });
  });

  it('500 で kind="server"', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ message: 'oops' }, { status: 500 }));

    await expect(getRepository({ owner: 'vercel', name: 'next.js' })).rejects.toMatchObject({
      kind: 'server',
    });
  });

  it('未分類のステータス（418 等）で kind="unknown"', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ message: 'teapot' }, { status: 418 }));

    await expect(getRepository({ owner: 'vercel', name: 'next.js' })).rejects.toMatchObject({
      kind: 'unknown',
      status: 418,
    });
  });

  it('fetch が TypeError を投げると kind="network"', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError('failed to fetch'));

    await expect(getRepository({ owner: 'vercel', name: 'next.js' })).rejects.toMatchObject({
      kind: 'network',
    });
  });

  it('AbortError はそのまま再 throw する', async () => {
    vi.mocked(fetch).mockImplementationOnce((_url, init: RequestInit = {}) => {
      return new Promise((_resolve, reject) => {
        init.signal?.addEventListener('abort', () => {
          reject(new DOMException('aborted', 'AbortError'));
        });
      });
    });

    const controller = new AbortController();
    const promise = getRepository({ owner: 'vercel', name: 'next.js' }, { signal: controller.signal });
    controller.abort();

    await expect(promise).rejects.toMatchObject({ name: 'AbortError' });
  });
});

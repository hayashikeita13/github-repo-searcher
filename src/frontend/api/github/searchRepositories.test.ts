import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { searchRepositories } from './searchRepositories';
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

const validResponse = {
  total_count: 1,
  incomplete_results: false,
  items: [validRepository],
};

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
}

describe('searchRepositories', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('q, page, per_page を含む URL で fetch を呼ぶ', async () => {
    const fetchMock = vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(validResponse));

    await searchRepositories({ q: 'react', page: 2, perPage: 50 });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('https://api.github.com/search/repositories');
    expect(url).toContain('q=react');
    expect(url).toContain('page=2');
    expect(url).toContain('per_page=50');
  });

  it('正常レスポンスをそのまま返す', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(validResponse));

    const result = await searchRepositories({ q: 'react', page: 1, perPage: 50 });

    expect(result.total_count).toBe(1);
    expect(result.items[0].full_name).toBe('vercel/next.js');
  });

  it('空 q で validation エラーを throw（fetch は呼ばれない）', async () => {
    const fetchMock = vi.mocked(fetch);

    await expect(searchRepositories({ q: '   ', page: 1, perPage: 50 })).rejects.toMatchObject({
      kind: 'validation',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('page < 1 で validation エラーを throw', async () => {
    await expect(searchRepositories({ q: 'react', page: 0, perPage: 50 })).rejects.toBeInstanceOf(GithubApiError);
  });

  it('レスポンスが schema に違反したら kind="unknown" を throw', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ bogus: true }));

    await expect(searchRepositories({ q: 'react', page: 1, perPage: 50 })).rejects.toMatchObject({
      kind: 'unknown',
    });
  });

  it('403 + X-RateLimit-Remaining: 0 で kind="rate_limit"', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ message: 'rate limit exceeded' }, { status: 403, headers: { 'X-RateLimit-Remaining': '0' } })
    );

    await expect(searchRepositories({ q: 'react', page: 1, perPage: 50 })).rejects.toMatchObject({
      kind: 'rate_limit',
    });
  });

  it('403 で X-RateLimit-Remaining > 0 なら kind="forbidden"', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ message: 'forbidden' }, { status: 403, headers: { 'X-RateLimit-Remaining': '10' } })
    );

    await expect(searchRepositories({ q: 'react', page: 1, perPage: 50 })).rejects.toMatchObject({
      kind: 'forbidden',
    });
  });

  it('422 で kind="validation"', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ message: 'invalid' }, { status: 422 }));

    await expect(searchRepositories({ q: 'react', page: 1, perPage: 50 })).rejects.toMatchObject({
      kind: 'validation',
    });
  });

  it('500 で kind="server"', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ message: 'oops' }, { status: 500 }));

    await expect(searchRepositories({ q: 'react', page: 1, perPage: 50 })).rejects.toMatchObject({
      kind: 'server',
    });
  });

  it('404 で kind="not_found"', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ message: 'not found' }, { status: 404 }));

    await expect(searchRepositories({ q: 'react', page: 1, perPage: 50 })).rejects.toMatchObject({
      kind: 'not_found',
    });
  });

  it('未分類のステータス（418 等）で kind="unknown"', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ message: 'teapot' }, { status: 418 }));

    await expect(searchRepositories({ q: 'react', page: 1, perPage: 50 })).rejects.toMatchObject({
      kind: 'unknown',
      status: 418,
    });
  });

  it('fetch が TypeError を投げると kind="network"', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError('failed to fetch'));

    await expect(searchRepositories({ q: 'react', page: 1, perPage: 50 })).rejects.toMatchObject({
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
    const promise = searchRepositories({ q: 'react', page: 1, perPage: 50 }, { signal: controller.signal });
    controller.abort();

    await expect(promise).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('opts.next を渡したとき fetch に next オプションが渡り cache は付かない', async () => {
    const fetchMock = vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(validResponse));

    await searchRepositories({ q: 'react', page: 1, perPage: 50 }, { next: { revalidate: 60, tags: ['search'] } });

    const init = fetchMock.mock.calls[0][1] as RequestInit & {
      next?: { revalidate?: number | false; tags?: string[] };
    };
    expect(init.next).toEqual({ revalidate: 60, tags: ['search'] });
    expect(init.cache).toBeUndefined();
  });

  it('opts.next を渡さないとき cache も next も明示しない（Next.js 既定挙動に委ねる）', async () => {
    const fetchMock = vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(validResponse));

    await searchRepositories({ q: 'react', page: 1, perPage: 50 });

    const init = fetchMock.mock.calls[0][1] as RequestInit & { next?: unknown };
    expect(init.cache).toBeUndefined();
    expect(init.next).toBeUndefined();
  });
});

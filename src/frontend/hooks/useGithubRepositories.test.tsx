import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { SWRConfig } from 'swr';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useGithubRepositories } from './useGithubRepositories';

const repo = {
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

const validResponse = { total_count: 1, incomplete_results: false, items: [repo] };

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
}

function Wrapper({ children }: { children: ReactNode }) {
  return <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>{children}</SWRConfig>;
}

describe('useGithubRepositories', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('q が空のとき status は "idle"、fetch は呼ばれない', () => {
    const { result } = renderHook(() => useGithubRepositories({ q: '', page: 1 }), {
      wrapper: Wrapper,
    });

    expect(result.current.status).toBe('idle');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('q を渡すと loading → success へ遷移し data が入る', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(validResponse));

    const { result } = renderHook(() => useGithubRepositories({ q: 'react', page: 1 }), {
      wrapper: Wrapper,
    });

    expect(result.current.status).toBe('loading');

    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.data?.total_count).toBe(1);
    expect(result.current.data?.items[0].full_name).toBe('vercel/next.js');
  });

  it('API がレート制限エラーを返すと status=error, kind="rate_limit"', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({}, { status: 403, headers: { 'X-RateLimit-Remaining': '0' } })
    );

    const { result } = renderHook(() => useGithubRepositories({ q: 'react', page: 1 }), {
      wrapper: Wrapper,
    });

    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.error?.kind).toBe('rate_limit');
  });

  it('q が変わると新しい fetch が走る', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse(validResponse))
      .mockResolvedValueOnce(jsonResponse({ ...validResponse, total_count: 2 }));

    const { result, rerender } = renderHook(({ q }: { q: string }) => useGithubRepositories({ q, page: 1 }), {
      wrapper: Wrapper,
      initialProps: { q: 'react' },
    });

    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current.data?.total_count).toBe(1);

    rerender({ q: 'vue' });

    await waitFor(() => expect(result.current.data?.total_count).toBe(2));
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});

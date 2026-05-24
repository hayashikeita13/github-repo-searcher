'use client';

import useSWR from 'swr';
import { searchRepositories } from '@/frontend/api/github/searchRepositories';
import { GithubApiError, type SearchRepositoriesResponse } from '@/frontend/api/github/types';

type Status = 'idle' | 'loading' | 'success' | 'error';

type Args = { q: string; page: number; perPage?: number };

type Return = {
  status: Status;
  data: SearchRepositoriesResponse | null;
  error: GithubApiError | null;
};

type Key = readonly ['github-search', string, number, number];

const fetcher = ([, q, page, perPage]: Key) => searchRepositories({ q, page, perPage });

function toGithubApiError(err: unknown): GithubApiError {
  if (err instanceof GithubApiError) return err;
  return new GithubApiError('unknown', err instanceof Error ? err.message : '不明なエラー');
}

export function useGithubRepositories({ q, page, perPage = 50 }: Args): Return {
  const trimmed = q.trim();
  const key: Key | null = trimmed === '' ? null : ['github-search', trimmed, page, perPage];

  const { data, error, isLoading } = useSWR<SearchRepositoriesResponse, unknown, Key | null>(key, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
  });

  if (trimmed === '') return { status: 'idle', data: null, error: null };
  if (error) return { status: 'error', data: null, error: toGithubApiError(error) };
  if (isLoading || !data) return { status: 'loading', data: null, error: null };
  return { status: 'success', data, error: null };
}

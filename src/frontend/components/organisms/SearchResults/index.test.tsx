import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { searchRepositories } from '@/frontend/api/github/searchRepositories';
import type { GithubRepository } from '@/frontend/api/github/types';
import { GithubApiError } from '@/frontend/api/github/types';

import SearchResults from './index';

vi.mock('@/frontend/api/github/searchRepositories', () => ({
  searchRepositories: vi.fn(),
}));

const mockedSearch = vi.mocked(searchRepositories);

const repo: GithubRepository = {
  id: 1,
  name: 'next.js',
  full_name: 'vercel/next.js',
  owner: { login: 'vercel', avatar_url: 'https://avatars.githubusercontent.com/u/14985020?v=4' },
  html_url: 'https://github.com/vercel/next.js',
  language: 'JavaScript',
  stargazers_count: 1,
  watchers_count: 1,
  forks_count: 1,
  open_issues_count: 1,
};

describe('SearchResults (Server Component)', () => {
  beforeEach(() => {
    mockedSearch.mockReset();
  });

  it('q が undefined のとき initial の EmptyState を返す', async () => {
    const ui = await SearchResults({ page: 1 });
    render(ui);
    expect(screen.getByText('キーワードを入力して検索してください')).toBeInTheDocument();
    expect(mockedSearch).not.toHaveBeenCalled();
  });

  it('success で items 3 件と Pagination を表示', async () => {
    mockedSearch.mockResolvedValueOnce({
      total_count: 200,
      incomplete_results: false,
      items: [repo, { ...repo, id: 2 }, { ...repo, id: 3 }],
    });

    const ui = await SearchResults({ q: 'react', page: 1 });
    render(ui);

    expect(screen.getAllByRole('link', { name: /vercel\/next\.js/ })).toHaveLength(3);
    expect(screen.getByLabelText('1')).toHaveAttribute('aria-current', 'page');
  });

  it('Pagination のリンクが URL クエリを含む', async () => {
    mockedSearch.mockResolvedValueOnce({
      total_count: 200,
      incomplete_results: false,
      items: [repo],
    });

    const ui = await SearchResults({ q: 'react', page: 1 });
    render(ui);

    expect(screen.getByRole('link', { name: '3' })).toHaveAttribute('href', '/?q=react&page=3');
  });

  it('success で items=[] のとき no-results を表示', async () => {
    mockedSearch.mockResolvedValueOnce({
      total_count: 0,
      incomplete_results: false,
      items: [],
    });

    const ui = await SearchResults({ q: 'react', page: 1 });
    render(ui);
    expect(screen.getByText('該当するリポジトリは見つかりませんでした')).toBeInTheDocument();
  });

  it('rate_limit エラーで error の EmptyState を表示', async () => {
    mockedSearch.mockRejectedValueOnce(new GithubApiError('rate_limit', 'x'));

    const ui = await SearchResults({ q: 'react', page: 1 });
    render(ui);
    expect(screen.getByRole('alert')).toHaveTextContent(/レート制限/);
  });

  it('server エラーは throw して error.tsx に委譲する', async () => {
    mockedSearch.mockRejectedValueOnce(new GithubApiError('server', 'oops'));
    await expect(SearchResults({ q: 'react', page: 1 })).rejects.toMatchObject({ kind: 'server' });
  });

  it('network エラーは throw して error.tsx に委譲する', async () => {
    mockedSearch.mockRejectedValueOnce(new GithubApiError('network', 'down'));
    await expect(SearchResults({ q: 'react', page: 1 })).rejects.toMatchObject({ kind: 'network' });
  });

  it('GithubApiError でない例外もそのまま throw する', async () => {
    mockedSearch.mockRejectedValueOnce(new Error('boom'));
    await expect(SearchResults({ q: 'react', page: 1 })).rejects.toThrow('boom');
  });

  it('validation エラーは EmptyState で吸収', async () => {
    mockedSearch.mockRejectedValueOnce(new GithubApiError('validation', '不正'));
    const ui = await SearchResults({ q: 'react', page: 1 });
    render(ui);
    expect(screen.getByRole('alert')).toHaveTextContent(/不正/);
  });
});

import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getRepository } from '@/frontend/api/github/getRepository';
import type { GithubRepository } from '@/frontend/api/github/types';
import { GithubApiError } from '@/frontend/api/github/types';

vi.mock('@/frontend/api/github/getRepository', () => ({
  getRepository: vi.fn(),
}));

const notFoundMock = vi.fn(() => {
  throw new Error('NEXT_NOT_FOUND');
});

vi.mock('next/navigation', () => ({
  notFound: () => notFoundMock(),
}));

import Page, { generateMetadata } from './page';

const repo: GithubRepository = {
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

describe('app/repositories/[owner]/[name]/page', () => {
  beforeEach(() => {
    vi.mocked(getRepository).mockReset();
    notFoundMock.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('generateMetadata', () => {
    it('正常な owner/name で title/description を返す', async () => {
      const meta = await generateMetadata({ params: Promise.resolve({ owner: 'vercel', name: 'next.js' }) });
      expect(meta.title).toBe('vercel/next.js');
      expect(meta.description).toContain('vercel/next.js');
      expect(meta.openGraph?.title).toBe('vercel/next.js');
      expect(meta.twitter).toMatchObject({ card: 'summary', title: 'vercel/next.js' });
    });

    it('不正な params なら空 metadata を返す', async () => {
      const meta = await generateMetadata({ params: Promise.resolve({ owner: '', name: '' }) });
      expect(meta).toEqual({});
    });
  });

  describe('Page', () => {
    it('正常時は RepositoryDetailTemplate をレンダリングする', async () => {
      vi.mocked(getRepository).mockResolvedValueOnce(repo);
      const ui = await Page({ params: Promise.resolve({ owner: 'vercel', name: 'next.js' }) });
      render(ui);
      expect(screen.getByRole('heading', { name: 'vercel/next.js' })).toBeInTheDocument();
    });

    it('不正な params で notFound() を呼ぶ', async () => {
      await expect(Page({ params: Promise.resolve({ owner: '', name: '' }) })).rejects.toThrow('NEXT_NOT_FOUND');
      expect(notFoundMock).toHaveBeenCalledTimes(1);
      expect(getRepository).not.toHaveBeenCalled();
    });

    it('getRepository が not_found を投げると notFound() を呼ぶ', async () => {
      vi.mocked(getRepository).mockRejectedValueOnce(new GithubApiError('not_found', 'x'));
      await expect(Page({ params: Promise.resolve({ owner: 'vercel', name: 'unknown' }) })).rejects.toThrow(
        'NEXT_NOT_FOUND'
      );
      expect(notFoundMock).toHaveBeenCalledTimes(1);
    });

    it('getRepository が not_found 以外のエラーを投げるとそのまま再 throw', async () => {
      vi.mocked(getRepository).mockRejectedValueOnce(new GithubApiError('rate_limit', 'rate'));
      await expect(Page({ params: Promise.resolve({ owner: 'vercel', name: 'next.js' }) })).rejects.toMatchObject({
        kind: 'rate_limit',
      });
      expect(notFoundMock).not.toHaveBeenCalled();
    });

    it('getRepository が GithubApiError でない例外を投げるとそのまま再 throw', async () => {
      vi.mocked(getRepository).mockRejectedValueOnce(new Error('boom'));
      await expect(Page({ params: Promise.resolve({ owner: 'vercel', name: 'next.js' }) })).rejects.toThrow('boom');
    });
  });
});

import type { ReactNode } from 'react';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { GithubRepository } from '@/frontend/api/github/types';
import { RepositoriesProvider, useRepositories } from './RepositoriesContext';

const baseRepo: GithubRepository = {
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

function Wrapper({ children }: { children: ReactNode }) {
  return <RepositoriesProvider>{children}</RepositoriesProvider>;
}

describe('RepositoriesContext', () => {
  it('saveRepositories の後、getRepository で同じ repo を取り出せる', () => {
    const { result } = renderHook(() => useRepositories(), { wrapper: Wrapper });

    act(() => {
      result.current.saveRepositories([baseRepo]);
    });

    expect(result.current.getRepository('vercel', 'next.js')).toEqual(baseRepo);
  });

  it('保存していない owner/name は undefined を返す', () => {
    const { result } = renderHook(() => useRepositories(), { wrapper: Wrapper });

    expect(result.current.getRepository('vercel', 'unknown')).toBeUndefined();
  });

  it('同じ owner/name で再 save すると後勝ちで上書きされる', () => {
    const { result } = renderHook(() => useRepositories(), { wrapper: Wrapper });
    const updated: GithubRepository = { ...baseRepo, stargazers_count: 999 };

    act(() => {
      result.current.saveRepositories([baseRepo]);
    });
    act(() => {
      result.current.saveRepositories([updated]);
    });

    expect(result.current.getRepository('vercel', 'next.js')?.stargazers_count).toBe(999);
  });

  it('複数件まとめて save できる', () => {
    const { result } = renderHook(() => useRepositories(), { wrapper: Wrapper });
    const other: GithubRepository = {
      ...baseRepo,
      id: 2,
      name: 'react',
      full_name: 'facebook/react',
      owner: { login: 'facebook', avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4' },
    };

    act(() => {
      result.current.saveRepositories([baseRepo, other]);
    });

    expect(result.current.getRepository('vercel', 'next.js')).toBeDefined();
    expect(result.current.getRepository('facebook', 'react')).toBeDefined();
  });

  it('Provider の外で使うと throw する', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useRepositories())).toThrowError(
      /useRepositories must be used within RepositoriesProvider/
    );
    errorSpy.mockRestore();
  });
});

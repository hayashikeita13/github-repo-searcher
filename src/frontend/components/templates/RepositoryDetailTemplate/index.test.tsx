import type { ReactNode } from 'react';
import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { GithubRepository } from '@/frontend/api/github/types';
import { RepositoriesProvider, useRepositories } from '@/frontend/contexts/RepositoriesContext';
import RepositoryDetailTemplate from './index';

const replaceMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

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

type ContextValue = ReturnType<typeof useRepositories>;

function Wrapper({ children }: { children: ReactNode }) {
  return <RepositoriesProvider>{children}</RepositoriesProvider>;
}

function Capture({ onReady }: { onReady: (ctx: ContextValue) => void }) {
  const ctx = useRepositories();
  onReady(ctx);
  return null;
}

describe('RepositoryDetailTemplate', () => {
  beforeEach(() => {
    replaceMock.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('Context に repo があるとき RepositoryDetail を表示し、replace は呼ばれない', () => {
    let captured: ContextValue | null = null;

    const { rerender } = render(
      <Wrapper>
        <Capture onReady={(ctx) => (captured = ctx)} />
      </Wrapper>
    );

    act(() => {
      captured!.saveRepositories([baseRepo]);
    });

    rerender(
      <Wrapper>
        <Capture onReady={(ctx) => (captured = ctx)} />
        <RepositoryDetailTemplate owner='vercel' name='next.js' />
      </Wrapper>
    );

    expect(screen.getByRole('heading', { name: 'vercel/next.js' })).toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it('Context に repo が無いとき router.replace("/") が呼ばれる', () => {
    render(
      <Wrapper>
        <RepositoryDetailTemplate owner='vercel' name='unknown' />
      </Wrapper>
    );

    expect(replaceMock).toHaveBeenCalledWith('/');
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });
});

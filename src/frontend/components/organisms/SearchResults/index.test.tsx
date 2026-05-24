import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GithubRepository } from '@/frontend/api/github/types';
import { GithubApiError } from '@/frontend/api/github/types';
import { RepositoriesProvider, useRepositories } from '@/frontend/contexts/RepositoriesContext';
import SearchResults from './index';

const pushMock = vi.fn();
let searchParamsValue = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => searchParamsValue,
  usePathname: () => '/',
}));

const hookReturn = {
  status: 'idle' as 'idle' | 'loading' | 'success' | 'error',
  data: null as { total_count: number; incomplete_results: boolean; items: GithubRepository[] } | null,
  error: null as GithubApiError | null,
};

vi.mock('@/frontend/hooks/useGithubRepositories', () => ({
  useGithubRepositories: () => hookReturn,
}));

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

function setHook(next: Partial<typeof hookReturn>) {
  Object.assign(hookReturn, next);
}

function Wrapper({ children }: { children: ReactNode }) {
  return <RepositoriesProvider>{children}</RepositoriesProvider>;
}

function renderWithProvider() {
  return render(<SearchResults />, { wrapper: Wrapper });
}

describe('SearchResults', () => {
  beforeEach(() => {
    pushMock.mockReset();
    searchParamsValue = new URLSearchParams();
    setHook({ status: 'idle', data: null, error: null });
  });

  it('q が無いとき initial の EmptyState を表示', () => {
    renderWithProvider();
    expect(screen.getByText('キーワードを入力して検索してください')).toBeInTheDocument();
  });

  it('loading のときスケルトン領域を表示', () => {
    searchParamsValue = new URLSearchParams('q=react');
    setHook({ status: 'loading', data: null, error: null });
    renderWithProvider();
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
  });

  it('success で items 3 件と Pagination を表示', () => {
    searchParamsValue = new URLSearchParams('q=react&page=1');
    setHook({
      status: 'success',
      data: { total_count: 200, incomplete_results: false, items: [repo, { ...repo, id: 2 }, { ...repo, id: 3 }] },
      error: null,
    });
    renderWithProvider();
    expect(screen.getAllByRole('link')).toHaveLength(3);
    // Pagination: list items に「1」が存在
    expect(screen.getByRole('listitem', { name: '1' })).toBeInTheDocument();
  });

  it('success で items=[] のとき no-results を表示', () => {
    searchParamsValue = new URLSearchParams('q=react');
    setHook({ status: 'success', data: { total_count: 0, incomplete_results: false, items: [] }, error: null });
    renderWithProvider();
    expect(screen.getByText('該当するリポジトリは見つかりませんでした')).toBeInTheDocument();
  });

  it('error のとき error の EmptyState を表示（rate_limit メッセージ）', () => {
    searchParamsValue = new URLSearchParams('q=react');
    setHook({
      status: 'error',
      data: null,
      error: new GithubApiError('rate_limit', 'x'),
    });
    renderWithProvider();
    expect(screen.getByRole('alert')).toHaveTextContent(/レート制限/);
  });

  it('success のとき items が Context に保存される', () => {
    searchParamsValue = new URLSearchParams('q=react&page=1');
    setHook({
      status: 'success',
      data: { total_count: 1, incomplete_results: false, items: [repo] },
      error: null,
    });

    function CapturedRepo() {
      const { getRepository } = useRepositories();
      const found = getRepository('vercel', 'next.js');
      return <span data-testid='captured'>{found?.full_name ?? ''}</span>;
    }

    render(
      <Wrapper>
        <SearchResults />
        <CapturedRepo />
      </Wrapper>
    );

    expect(screen.getByTestId('captured')).toHaveTextContent('vercel/next.js');
  });

  it('Pagination のページ変更で router.push が新しい URL を呼ぶ', () => {
    searchParamsValue = new URLSearchParams('q=react&page=1');
    setHook({
      status: 'success',
      data: { total_count: 200, incomplete_results: false, items: [repo] },
      error: null,
    });
    renderWithProvider();

    fireEvent.click(screen.getByRole('listitem', { name: '3' }));
    expect(pushMock).toHaveBeenCalledWith('/?q=react&page=3');
  });
});

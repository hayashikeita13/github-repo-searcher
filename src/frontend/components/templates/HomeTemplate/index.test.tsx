import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { RepositoriesProvider } from '@/frontend/contexts/RepositoriesContext';

import HomeTemplate from './index';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

vi.mock('@/frontend/hooks/useGithubRepositories', () => ({
  useGithubRepositories: () => ({ status: 'idle', data: null, error: null }),
}));

function Wrapper({ children }: { children: ReactNode }) {
  return <RepositoriesProvider>{children}</RepositoriesProvider>;
}

function renderHome() {
  return render(<HomeTemplate />, { wrapper: Wrapper });
}

describe('HomeTemplate', () => {
  it('検索窓が表示される', () => {
    renderHome();
    expect(screen.getByPlaceholderText('リポジトリを検索')).toBeInTheDocument();
  });

  it('検索ボタンが表示される', () => {
    renderHome();
    expect(screen.getByRole('button', { name: '検索' })).toBeInTheDocument();
  });

  it('初期状態では initial の EmptyState が表示される', () => {
    renderHome();
    expect(screen.getByText('キーワードを入力して検索してください')).toBeInTheDocument();
  });
});

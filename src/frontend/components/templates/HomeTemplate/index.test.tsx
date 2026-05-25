import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import HomeTemplate from './index';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

vi.mock('@/frontend/hooks/useGithubRepositories', () => ({
  useGithubRepositories: () => ({ status: 'idle', data: null, error: null }),
}));

describe('HomeTemplate', () => {
  it('検索窓が表示される', () => {
    render(<HomeTemplate />);
    expect(screen.getByPlaceholderText('リポジトリを検索')).toBeInTheDocument();
  });

  it('検索ボタンが表示される', () => {
    render(<HomeTemplate />);
    expect(screen.getByRole('button', { name: '検索' })).toBeInTheDocument();
  });

  it('初期状態では initial の EmptyState が表示される', () => {
    render(<HomeTemplate />);
    expect(screen.getByText('キーワードを入力して検索してください')).toBeInTheDocument();
  });
});

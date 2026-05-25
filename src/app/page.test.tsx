import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/frontend/components/organisms/SearchResults', () => ({
  default: ({ q, page }: { q?: string; page: number }) => (
    <div data-testid='search-results'>
      q={String(q)};page={page}
    </div>
  ),
}));

vi.mock('@/frontend/components/organisms/SearchResults/Skeleton', () => ({
  default: () => <div data-testid='skeleton' />,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

import Page from './page';

async function renderPage(searchParams: Record<string, string | undefined>) {
  const ui = await Page({ searchParams: Promise.resolve(searchParams) });
  render(ui);
}

describe('app/page', () => {
  it('searchParams が空のとき q=undefined, page=1 で SearchResults を呼ぶ', async () => {
    await renderPage({});
    expect(screen.getByTestId('search-results')).toHaveTextContent('q=undefined;page=1');
  });

  it('searchParams に q と page を含むと両方を渡す', async () => {
    await renderPage({ q: 'react', page: '3' });
    expect(screen.getByTestId('search-results')).toHaveTextContent('q=react;page=3');
  });

  it('不正な page でも safeParse 失敗 → デフォルト挙動になる', async () => {
    await renderPage({ q: 'react', page: 'abc' });
    expect(screen.getByTestId('search-results')).toHaveTextContent('q=undefined;page=1');
  });

  it('HomeTemplate（検索窓）の中にレンダリングされる', async () => {
    await renderPage({ q: 'react', page: '1' });
    expect(screen.getByPlaceholderText('リポジトリを検索')).toBeInTheDocument();
  });
});

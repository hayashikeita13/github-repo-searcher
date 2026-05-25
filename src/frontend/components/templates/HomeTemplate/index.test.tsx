import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import HomeTemplate from './index';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

describe('HomeTemplate', () => {
  it('検索窓が表示される', () => {
    render(
      <HomeTemplate>
        <div />
      </HomeTemplate>
    );
    expect(screen.getByPlaceholderText('リポジトリを検索')).toBeInTheDocument();
  });

  it('検索ボタンが表示される', () => {
    render(
      <HomeTemplate>
        <div />
      </HomeTemplate>
    );
    expect(screen.getByRole('button', { name: '検索' })).toBeInTheDocument();
  });

  it('children をそのままレンダリングする', () => {
    render(
      <HomeTemplate>
        <p>本文コンテンツ</p>
      </HomeTemplate>
    );
    expect(screen.getByText('本文コンテンツ')).toBeInTheDocument();
  });
});

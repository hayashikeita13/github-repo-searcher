import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import SearchForm from './index';

const pushMock = vi.fn();
let searchParamsValue = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => searchParamsValue,
  usePathname: () => '/',
}));

describe('SearchForm', () => {
  beforeEach(() => {
    pushMock.mockReset();
    searchParamsValue = new URLSearchParams();
  });

  it('検索窓（placeholder「リポジトリを検索」）が表示される', () => {
    render(<SearchForm />);
    expect(screen.getByPlaceholderText('リポジトリを検索')).toBeInTheDocument();
  });

  it('検索キーワード入力用の searchbox が存在する', () => {
    render(<SearchForm />);
    expect(screen.getByRole('searchbox', { name: 'リポジトリを検索' })).toBeInTheDocument();
  });

  it('「検索」ボタンが表示される', () => {
    render(<SearchForm />);
    expect(screen.getByRole('button', { name: '検索' })).toBeInTheDocument();
  });

  it('URL クエリ ?q=foo があると input の初期値が "foo" になる', () => {
    searchParamsValue = new URLSearchParams('q=foo');
    render(<SearchForm />);
    expect(screen.getByRole('searchbox')).toHaveValue('foo');
  });

  it('検索ボタンクリックで router.push が /?q=<encoded>&page=1 を呼ぶ', async () => {
    const user = userEvent.setup();
    render(<SearchForm />);
    const input = screen.getByRole('searchbox');
    await user.type(input, 'react hooks');
    await user.click(screen.getByRole('button', { name: '検索' }));
    expect(pushMock).toHaveBeenCalledWith('/?q=react+hooks&page=1');
  });

  it('空白のみのとき router.push は呼ばれない', async () => {
    const user = userEvent.setup();
    render(<SearchForm />);
    const input = screen.getByRole('searchbox');
    await user.type(input, '   ');
    await user.click(screen.getByRole('button', { name: '検索' }));
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('URL の q が変わると input の表示値が追従する', () => {
    searchParamsValue = new URLSearchParams('q=A');
    const { rerender } = render(<SearchForm />);
    expect(screen.getByRole('searchbox')).toHaveValue('A');

    searchParamsValue = new URLSearchParams('q=B');
    rerender(<SearchForm />);
    expect(screen.getByRole('searchbox')).toHaveValue('B');
  });
});

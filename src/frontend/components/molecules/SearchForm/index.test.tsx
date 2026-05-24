import { fireEvent, render, screen } from '@testing-library/react';
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

  it('検索ボタンクリックで router.push が /?q=<encoded>&page=1 を呼ぶ', () => {
    render(<SearchForm />);
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'react hooks' } });
    fireEvent.click(screen.getByRole('button', { name: '検索' }));
    expect(pushMock).toHaveBeenCalledWith('/?q=react%20hooks&page=1');
  });

  it('空白のみのとき router.push は呼ばれない', () => {
    render(<SearchForm />);
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(screen.getByRole('button', { name: '検索' }));
    expect(pushMock).not.toHaveBeenCalled();
  });
});

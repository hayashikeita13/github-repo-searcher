import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Header from './index';

let searchParamsValue = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useSearchParams: () => searchParamsValue,
}));

describe('Header', () => {
  it('「Github Repository Searcher」が表示される', () => {
    searchParamsValue = new URLSearchParams();
    render(<Header />);
    expect(screen.getByText('Github Repository Searcher')).toBeInTheDocument();
  });

  it('検索クエリが無いときは / にリンクする', () => {
    searchParamsValue = new URLSearchParams();
    render(<Header />);
    const link = screen.getByRole('link', { name: 'Github Repository Searcher' });
    expect(link).toHaveAttribute('href', '/');
  });

  it('検索クエリ q があれば ?q= を保持してリンクする', () => {
    searchParamsValue = new URLSearchParams('q=react');
    render(<Header />);
    const link = screen.getByRole('link', { name: 'Github Repository Searcher' });
    expect(link).toHaveAttribute('href', '/?q=react');
  });

  it('q に特殊文字が含まれる場合はエンコードされる', () => {
    searchParamsValue = new URLSearchParams('q=hello world');
    render(<Header />);
    const link = screen.getByRole('link', { name: 'Github Repository Searcher' });
    expect(link).toHaveAttribute('href', '/?q=hello%20world');
  });
});

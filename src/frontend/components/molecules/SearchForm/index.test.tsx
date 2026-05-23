import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SearchForm from './index';

describe('SearchForm', () => {
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
});

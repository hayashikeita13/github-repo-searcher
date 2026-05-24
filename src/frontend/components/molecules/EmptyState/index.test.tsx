import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import EmptyState from './index';

describe('EmptyState', () => {
  it('variant="initial" でガイダンス文言を表示する', () => {
    render(<EmptyState variant='initial' />);
    expect(screen.getByText('キーワードを入力して検索してください')).toBeInTheDocument();
  });

  it('variant="no-results" で結果なしの文言を表示する', () => {
    render(<EmptyState variant='no-results' />);
    expect(screen.getByText('該当するリポジトリは見つかりませんでした')).toBeInTheDocument();
  });

  it('variant="error" で渡された message を表示する', () => {
    render(<EmptyState variant='error' message='レート制限に達しました' />);
    expect(screen.getByText('レート制限に達しました')).toBeInTheDocument();
  });

  it('variant="error" で message 未指定なら既定文言を表示する', () => {
    render(<EmptyState variant='error' />);
    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
  });
});

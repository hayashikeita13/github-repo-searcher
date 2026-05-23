import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HomeTemplate from './index';

describe('HomeTemplate', () => {
  it('検索窓が表示される', () => {
    render(<HomeTemplate />);
    expect(screen.getByPlaceholderText('リポジトリを検索')).toBeInTheDocument();
  });

  it('検索ボタンが表示される', () => {
    render(<HomeTemplate />);
    expect(screen.getByRole('button', { name: '検索' })).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import NotFound from './not-found';

describe('app/not-found', () => {
  it('alert ロールで 404 メッセージを表示する', () => {
    render(<NotFound />);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('ページが見つかりません');
  });

  it('ホームに戻るリンクが / を指す', () => {
    render(<NotFound />);
    const link = screen.getByRole('link', { name: 'ホームに戻る' });
    expect(link).toHaveAttribute('href', '/');
  });
});

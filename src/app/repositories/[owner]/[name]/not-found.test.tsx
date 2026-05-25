import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import NotFound from './not-found';

describe('app/repositories/[owner]/[name]/not-found', () => {
  it('alert ロールでメッセージとホームへのリンクを表示する', () => {
    render(<NotFound />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'リポジトリが見つかりません' })).toBeInTheDocument();
    const homeLink = screen.getByRole('link', { name: 'ホームに戻る' });
    expect(homeLink).toHaveAttribute('href', '/');
  });
});

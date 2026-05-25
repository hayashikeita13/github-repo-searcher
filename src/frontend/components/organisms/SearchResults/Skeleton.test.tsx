import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import SearchResultsSkeleton from './Skeleton';

describe('SearchResultsSkeleton', () => {
  it('aria-busy な status 要素を表示する', () => {
    render(<SearchResultsSkeleton />);
    const status = screen.getByRole('status', { name: '読み込み中' });
    expect(status).toBeInTheDocument();
    expect(status).toHaveAttribute('aria-busy', 'true');
  });

  it('スケルトンアイテムを 5 件レンダリングする', () => {
    const { container } = render(<SearchResultsSkeleton />);
    const status = container.querySelector('[role="status"]');
    expect(status?.children.length).toBe(5);
  });
});

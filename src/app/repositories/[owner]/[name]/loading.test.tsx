import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Loading from './loading';

describe('app/repositories/[owner]/[name]/loading', () => {
  it('aria-busy な status を表示し、ローディングテキストを含む', () => {
    render(<Loading />);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-busy', 'true');
    expect(status).toHaveTextContent('リポジトリ情報を取得中');
  });
});

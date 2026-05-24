import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Header from './index';

describe('Header', () => {
  it('「Github Repository Searcher」が表示される', () => {
    render(<Header />);
    expect(screen.getByText('Github Repository Searcher')).toBeInTheDocument();
  });

  it('「Github Repository Searcher」がホーム（/）へのリンクになっている', () => {
    render(<Header />);
    const link = screen.getByRole('link', { name: 'Github Repository Searcher' });
    expect(link).toHaveAttribute('href', '/');
  });
});

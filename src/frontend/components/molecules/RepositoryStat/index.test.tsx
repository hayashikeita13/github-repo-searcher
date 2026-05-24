import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import RepositoryStat from './index';

describe('RepositoryStat', () => {
  it('label と value を描画する', () => {
    render(<RepositoryStat label='Stars' value='1,234' />);
    expect(screen.getByText('Stars')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('value は数値でも文字列でも受け取れる', () => {
    render(<RepositoryStat label='Forks' value={42} />);
    expect(screen.getByText('Forks')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });
});

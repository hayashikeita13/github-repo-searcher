import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HomeTemplate from './index';

describe('HomeTemplate', () => {
  it('「home template」がホーム画面に表示される', () => {
    render(<HomeTemplate />);
    expect(screen.getByText('home template')).toBeInTheDocument();
  });
});

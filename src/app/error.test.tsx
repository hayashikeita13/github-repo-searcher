import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Error from './error';

describe('app/error', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('error.message を表示する', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<Error error={new globalThis.Error('boom')} reset={vi.fn()} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('boom')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '予期せぬエラーが発生しました' })).toBeInTheDocument();
  });

  it('マウント時に console.error にエラーを渡す', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const err = new globalThis.Error('boom');
    render(<Error error={err} reset={vi.fn()} />);
    expect(spy).toHaveBeenCalledWith(err);
  });

  it('「もう一度試す」ボタンで reset が呼ばれる', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const user = userEvent.setup();
    const reset = vi.fn();
    render(<Error error={new globalThis.Error('boom')} reset={reset} />);
    await user.click(screen.getByRole('button', { name: 'もう一度試す' }));
    expect(reset).toHaveBeenCalledTimes(1);
  });
});

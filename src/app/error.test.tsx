import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Error from './error';

describe('app/error', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('error.message を表示する', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<Error error={new globalThis.Error('boom')} unstable_retry={vi.fn()} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('boom')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '予期せぬエラーが発生しました' })).toBeInTheDocument();
  });

  it('マウント時に console.error にエラーを渡す', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const err = new globalThis.Error('boom');
    render(<Error error={err} unstable_retry={vi.fn()} />);
    expect(spy).toHaveBeenCalledWith(err);
  });

  it('「もう一度試す」ボタンで unstable_retry が呼ばれる', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const retry = vi.fn();
    render(<Error error={new globalThis.Error('boom')} unstable_retry={retry} />);
    fireEvent.click(screen.getByRole('button', { name: 'もう一度試す' }));
    expect(retry).toHaveBeenCalledTimes(1);
  });
});

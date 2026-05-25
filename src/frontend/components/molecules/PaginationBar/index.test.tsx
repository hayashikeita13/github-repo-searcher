import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PaginationBar from './index';

describe('PaginationBar', () => {
  it('total=0 のとき何も描画しない', () => {
    const { container } = render(<PaginationBar total={0} page={1} pageSize={50} q='react' />);
    expect(container.firstChild).toBeNull();
  });

  it('現在ページがアクティブ状態で表示される', () => {
    const { container } = render(<PaginationBar total={200} page={2} pageSize={50} q='react' />);
    const active = container.querySelector('.ant-pagination-item-active');
    expect(active).not.toBeNull();
    expect(active).toHaveTextContent('2');
  });

  it('各ページボタンが対応する URL の Link になる', () => {
    render(<PaginationBar total={200} page={1} pageSize={50} q='react' />);

    const link = screen.getByRole('link', { name: '3' });
    expect(link).toHaveAttribute('href', '/?q=react&page=3');
  });

  it('q に特殊文字が含まれる場合はエンコードされる', () => {
    render(<PaginationBar total={200} page={1} pageSize={50} q='hello world' />);

    const link = screen.getByRole('link', { name: '2' });
    expect(link).toHaveAttribute('href', '/?q=hello%20world&page=2');
  });

  it('total=5000 でも 1000 件にクランプされ最終ページが 20 になる', () => {
    render(<PaginationBar total={5000} page={1} pageSize={50} q='react' />);
    expect(screen.getByRole('listitem', { name: '20' })).toBeInTheDocument();
    expect(screen.queryByRole('listitem', { name: '21' })).not.toBeInTheDocument();
  });
});

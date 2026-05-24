import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import PaginationBar from './index';

describe('PaginationBar', () => {
  it('total=0 のとき何も描画しない', () => {
    const { container } = render(<PaginationBar total={0} page={1} pageSize={50} onChange={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('現在ページがアクティブ状態で表示される', () => {
    const { container } = render(<PaginationBar total={200} page={2} pageSize={50} onChange={() => {}} />);
    const active = container.querySelector('.ant-pagination-item-active');
    expect(active).not.toBeNull();
    expect(active).toHaveTextContent('2');
  });

  it('別のページボタンをクリックすると onChange が呼ばれる', () => {
    const onChange = vi.fn();
    render(<PaginationBar total={200} page={1} pageSize={50} onChange={onChange} />);

    fireEvent.click(screen.getByRole('listitem', { name: '3' }));
    expect(onChange).toHaveBeenCalledWith(3, expect.any(Number));
  });

  it('total=5000 でも 1000 件にクランプされ最終ページが 20 になる', () => {
    render(<PaginationBar total={5000} page={1} pageSize={50} onChange={() => {}} />);
    // 20 ページ目のボタンが「最終ページ」として存在する
    expect(screen.getByRole('listitem', { name: '20' })).toBeInTheDocument();
    // 21 ページ目は存在しない
    expect(screen.queryByRole('listitem', { name: '21' })).not.toBeInTheDocument();
  });
});

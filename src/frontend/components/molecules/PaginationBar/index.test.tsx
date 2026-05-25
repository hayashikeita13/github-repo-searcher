import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PaginationBar from './index';

describe('PaginationBar', () => {
  it('total=0 のとき何も描画しない', () => {
    const { container } = render(<PaginationBar total={0} page={1} pageSize={50} q='react' />);
    expect(container.firstChild).toBeNull();
  });

  it('現在ページに aria-current="page" が付く', () => {
    render(<PaginationBar total={200} page={2} pageSize={50} q='react' />);
    const current = screen.getByLabelText('2');
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current).toHaveTextContent('2');
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
    expect(screen.getByLabelText('20')).toBeInTheDocument();
    expect(screen.queryByLabelText('21')).not.toBeInTheDocument();
  });

  it('1ページ目では「前へ」がリンクではなく disabled になる', () => {
    render(<PaginationBar total={200} page={1} pageSize={50} q='react' />);
    expect(screen.queryByRole('link', { name: '前のページへ' })).not.toBeInTheDocument();
    const prev = screen.getByText('前へ');
    expect(prev).toHaveAttribute('aria-disabled', 'true');
  });

  it('最終ページでは「次へ」がリンクではなく disabled になる', () => {
    render(<PaginationBar total={200} page={4} pageSize={50} q='react' />);
    expect(screen.queryByRole('link', { name: '次のページへ' })).not.toBeInTheDocument();
    const next = screen.getByText('次へ');
    expect(next).toHaveAttribute('aria-disabled', 'true');
  });

  it('中間ページでは「前へ」「次へ」両方リンクになる', () => {
    render(<PaginationBar total={200} page={2} pageSize={50} q='react' />);
    expect(screen.getByRole('link', { name: '前のページへ' })).toHaveAttribute('href', '/?q=react&page=1');
    expect(screen.getByRole('link', { name: '次のページへ' })).toHaveAttribute('href', '/?q=react&page=3');
  });

  it('総ページ数が多いとき省略記号で短縮される', () => {
    render(<PaginationBar total={5000} page={10} pageSize={50} q='react' />);
    expect(screen.getAllByText('…').length).toBeGreaterThan(0);
    expect(screen.getByLabelText('1')).toBeInTheDocument();
    expect(screen.getByLabelText('20')).toBeInTheDocument();
    expect(screen.getByLabelText('10')).toHaveAttribute('aria-current', 'page');
  });
});

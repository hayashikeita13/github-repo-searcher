'use client';

import { Pagination } from 'antd';
import Link from 'next/link';
import type { ReactNode } from 'react';

import styles from './index.module.scss';

const GITHUB_SEARCH_RESULT_LIMIT = 1000;

type Props = {
  total: number;
  page: number;
  pageSize: number;
  q: string;
};

type ItemType = 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next';

function buildHref(q: string, page: number) {
  return `/?q=${encodeURIComponent(q)}&page=${page}`;
}

export default function PaginationBar({ total, page, pageSize, q }: Props) {
  if (total <= 0) return null;

  const clampedTotal = Math.min(total, GITHUB_SEARCH_RESULT_LIMIT);

  const itemRender = (targetPage: number, type: ItemType, original: ReactNode) => {
    if (type === 'page' || type === 'prev' || type === 'next') {
      return (
        <Link href={buildHref(q, targetPage)} prefetch={false}>
          {original}
        </Link>
      );
    }
    return original;
  };

  return (
    <div className={styles.root}>
      <Pagination
        current={page}
        total={clampedTotal}
        pageSize={pageSize}
        showSizeChanger={false}
        itemRender={itemRender}
      />
    </div>
  );
}

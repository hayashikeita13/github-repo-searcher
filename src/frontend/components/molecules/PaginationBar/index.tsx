'use client';

import { Pagination } from 'antd';
import styles from './index.module.scss';

const GITHUB_SEARCH_RESULT_LIMIT = 1000;

type Props = {
  total: number;
  page: number;
  pageSize: number;
  onChange: (page: number) => void;
};

export default function PaginationBar({ total, page, pageSize, onChange }: Props) {
  if (total <= 0) return null;

  const clampedTotal = Math.min(total, GITHUB_SEARCH_RESULT_LIMIT);

  return (
    <div className={styles.root}>
      <Pagination current={page} total={clampedTotal} pageSize={pageSize} showSizeChanger={false} onChange={onChange} />
    </div>
  );
}

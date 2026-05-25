import Link from 'next/link';

import { GITHUB_SEARCH_RESULT_LIMIT } from '@/frontend/api/github/constants';

import styles from './index.module.scss';

type Props = {
  total: number;
  page: number;
  pageSize: number;
  q: string;
};

function buildHref(q: string, page: number) {
  return `/?q=${encodeURIComponent(q)}&page=${page}`;
}

function buildPageList(current: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [1];

  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);

  if (start > 2) pages.push('ellipsis');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages - 1) pages.push('ellipsis');

  pages.push(totalPages);
  return pages;
}

export default function PaginationBar({ total, page, pageSize, q }: Props) {
  if (total <= 0) return null;

  const clampedTotal = Math.min(total, GITHUB_SEARCH_RESULT_LIMIT);
  const totalPages = Math.max(1, Math.ceil(clampedTotal / pageSize));
  const pages = buildPageList(page, totalPages);

  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;

  return (
    <nav className={styles.root} aria-label='ページネーション'>
      <ul className={styles.list}>
        <li>
          {prevPage ? (
            <Link href={buildHref(q, prevPage)} prefetch={false} className={styles.item} aria-label='前のページへ'>
              前へ
            </Link>
          ) : (
            <span className={`${styles.item} ${styles.disabled}`} aria-disabled='true'>
              前へ
            </span>
          )}
        </li>
        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            <li key={`ellipsis-${i}`} aria-label={`ページ${i}`}>
              <span className={`${styles.item} ${styles.ellipsis}`} aria-hidden='true'>
                …
              </span>
            </li>
          ) : p === page ? (
            <li key={p} aria-label={String(p)} aria-current='page'>
              <span className={`${styles.item} ${styles.active}`}>{p}</span>
            </li>
          ) : (
            <li key={p} aria-label={String(p)}>
              <Link href={buildHref(q, p)} prefetch={false} className={styles.item} rel='nofollow'>
                {p}
              </Link>
            </li>
          )
        )}
        <li>
          {nextPage ? (
            <Link href={buildHref(q, nextPage)} prefetch={false} className={styles.item} aria-label='次のページへ'>
              次へ
            </Link>
          ) : (
            <span className={`${styles.item} ${styles.disabled}`} aria-disabled='true'>
              次へ
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}

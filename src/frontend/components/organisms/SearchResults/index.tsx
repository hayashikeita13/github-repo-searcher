'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { SearchUrlQuerySchema } from '@/frontend/api/github/schemas';
import type { GithubErrorKind } from '@/frontend/api/github/types';
import EmptyState from '@/frontend/components/molecules/EmptyState';
import PaginationBar from '@/frontend/components/molecules/PaginationBar';
import RepositoryList from '@/frontend/components/organisms/RepositoryList';
import { useRepositories } from '@/frontend/contexts/RepositoriesContext';
import { useGithubRepositories } from '@/frontend/hooks/useGithubRepositories';
import styles from './index.module.scss';

const PER_PAGE = 50;
const SKELETON_COUNT = 5;

const errorKindMessages: Record<GithubErrorKind, string> = {
  rate_limit: 'GitHub API のレート制限に達しました（未認証は 60req/h）。しばらく時間をおいて再度お試しください',
  validation: '検索キーワードが不正です',
  forbidden: 'アクセスが拒否されました',
  not_found: 'リソースが見つかりません',
  server: 'GitHub サーバでエラーが発生しました',
  network: 'ネットワークエラーが発生しました',
  unknown: '不明なエラーが発生しました',
};

export default function SearchResults() {
  const router = useRouter();
  const params = useSearchParams();

  const { q, page } = useMemo(() => {
    const parsed = SearchUrlQuerySchema.safeParse({
      q: params.get('q') ?? undefined,
      page: params.get('page') ?? undefined,
    });
    if (!parsed.success) return { q: undefined, page: 1 };
    return parsed.data;
  }, [params]);

  const { status, data, error } = useGithubRepositories({ q: q ?? '', page });

  const { saveRepositories } = useRepositories();
  useEffect(() => {
    if (status === 'success' && data) saveRepositories(data.items);
  }, [status, data, saveRepositories]);

  if (!q || status === 'idle') {
    return (
      <section className={styles.root}>
        <EmptyState variant='initial' />
      </section>
    );
  }

  if (status === 'loading') {
    return (
      <section className={styles.root}>
        <div className={styles.skeleton} role='status' aria-busy='true' aria-label='読み込み中'>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div key={i} className={styles.skeletonItem} />
          ))}
        </div>
      </section>
    );
  }

  if (status === 'error' && error) {
    return (
      <section className={styles.root}>
        <EmptyState variant='error' message={errorKindMessages[error.kind]} />
      </section>
    );
  }

  if (status === 'success' && data) {
    if (data.items.length === 0) {
      return (
        <section className={styles.root}>
          <EmptyState variant='no-results' />
        </section>
      );
    }

    const handlePageChange = (next: number) => {
      router.push(`/?q=${encodeURIComponent(q)}&page=${next}`);
    };

    return (
      <section className={styles.root}>
        <RepositoryList items={data.items} />
        <PaginationBar total={data.total_count} page={page} pageSize={PER_PAGE} onChange={handlePageChange} />
      </section>
    );
  }

  return null;
}

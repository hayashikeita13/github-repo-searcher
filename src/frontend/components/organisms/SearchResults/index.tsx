import { searchRepositories } from '@/frontend/api/github/searchRepositories';
import { GithubApiError, type GithubErrorKind, type SearchRepositoriesResponse } from '@/frontend/api/github/types';
import EmptyState from '@/frontend/components/molecules/EmptyState';
import PaginationBar from '@/frontend/components/molecules/PaginationBar';
import RepositoryList from '@/frontend/components/organisms/RepositoryList';

import styles from './index.module.scss';

const PER_PAGE = 50;

const errorKindMessages: Record<GithubErrorKind, string> = {
  rate_limit: 'GitHub API のレート制限に達しました（未認証は 60req/h）。しばらく時間をおいて再度お試しください',
  validation: '検索キーワードが不正です',
  forbidden: 'アクセスが拒否されました',
  not_found: 'リソースが見つかりません',
  server: 'GitHub サーバでエラーが発生しました',
  network: 'ネットワークエラーが発生しました',
  unknown: '不明なエラーが発生しました',
};

type LoadResult = { ok: true; data: SearchRepositoriesResponse } | { ok: false; kind: GithubErrorKind };

async function loadResults(q: string, page: number): Promise<LoadResult> {
  try {
    const data = await searchRepositories({ q, page, perPage: PER_PAGE }, { next: { revalidate: 60 } });
    return { ok: true, data };
  } catch (err) {
    const kind = err instanceof GithubApiError ? err.kind : 'unknown';
    return { ok: false, kind };
  }
}

type Props = { q?: string; page: number };

export default async function SearchResults({ q, page }: Props) {
  if (!q) {
    return (
      <section className={styles.root}>
        <EmptyState variant='initial' />
      </section>
    );
  }

  const result = await loadResults(q, page);

  if (!result.ok) {
    return (
      <section className={styles.root}>
        <EmptyState variant='error' message={errorKindMessages[result.kind]} />
      </section>
    );
  }

  if (result.data.items.length === 0) {
    return (
      <section className={styles.root}>
        <EmptyState variant='no-results' />
      </section>
    );
  }

  return (
    <section className={styles.root}>
      <RepositoryList items={result.data.items} />
      <PaginationBar total={result.data.total_count} page={page} pageSize={PER_PAGE} q={q} />
    </section>
  );
}

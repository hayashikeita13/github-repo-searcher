import { PER_PAGE } from '@/frontend/api/github/constants';
import { searchRepositories } from '@/frontend/api/github/searchRepositories';
import { GithubApiError, type GithubErrorKind } from '@/frontend/api/github/types';
import EmptyState from '@/frontend/components/molecules/EmptyState';
import PaginationBar from '@/frontend/components/molecules/PaginationBar';
import RepositoryList from '@/frontend/components/organisms/RepositoryList';

import styles from './index.module.scss';

const handledErrorMessages: Partial<Record<GithubErrorKind, string>> = {
  rate_limit: 'GitHub API のレート制限に達しました（未認証は 60req/h）。しばらく時間をおいて再度お試しください',
  validation: '検索キーワードが不正です',
  not_found: 'リソースが見つかりません',
  forbidden: 'アクセスが拒否されました',
};

type Props = { q?: string; page: number };

export default async function SearchResults({ q, page }: Props) {
  if (!q) {
    return (
      <section className={styles.root}>
        <EmptyState variant='initial' />
      </section>
    );
  }

  let data;
  try {
    data = await searchRepositories(
      { q, page, perPage: PER_PAGE },
      { next: { revalidate: 60, tags: ['github-search', `github-search:${q}`] } }
    );
  } catch (err) {
    if (err instanceof GithubApiError && err.kind in handledErrorMessages) {
      return (
        <section className={styles.root}>
          <EmptyState variant='error' message={handledErrorMessages[err.kind]} />
        </section>
      );
    }
    throw err;
  }

  if (data.items.length === 0) {
    return (
      <section className={styles.root}>
        <EmptyState variant='no-results' />
      </section>
    );
  }

  return (
    <section className={styles.root}>
      <RepositoryList items={data.items} />
      <PaginationBar total={data.total_count} page={page} pageSize={PER_PAGE} q={q} />
    </section>
  );
}

import type { GithubRepositorySummary } from '@/frontend/api/github/types';
import RepositoryCard from '@/frontend/components/molecules/RepositoryCard';

import styles from './index.module.scss';

type Props = { items: GithubRepositorySummary[] };

export default function RepositoryList({ items }: Props) {
  return (
    <ul className={styles.root}>
      {items.map((repo) => (
        <li key={repo.id}>
          <RepositoryCard repository={repo} />
        </li>
      ))}
    </ul>
  );
}

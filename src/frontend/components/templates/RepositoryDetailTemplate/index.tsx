import type { GithubRepository } from '@/frontend/api/github/types';
import RepositoryDetail from '@/frontend/components/organisms/RepositoryDetail';

import styles from './index.module.scss';

type Props = { repository: GithubRepository };

export default function RepositoryDetailTemplate({ repository }: Props) {
  return (
    <div className={styles.root}>
      <RepositoryDetail repository={repository} />
    </div>
  );
}

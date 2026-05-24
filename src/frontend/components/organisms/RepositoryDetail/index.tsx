import Image from 'next/image';
import type { GithubRepository } from '@/frontend/api/github/types';
import RepositoryStat from '@/frontend/components/molecules/RepositoryStat';
import styles from './index.module.scss';

type Props = { repository: GithubRepository };

export default function RepositoryDetail({ repository }: Props) {
  const { owner, full_name, language, stargazers_count, watchers_count, forks_count, open_issues_count } = repository;

  return (
    <article className={styles.root}>
      <header className={styles.header}>
        <Image
          src={owner.avatar_url}
          alt={`${owner.login} のアバター`}
          width={80}
          height={80}
          className={styles.avatar}
        />
        <h1 className={styles.name}>{full_name}</h1>
      </header>
      <dl className={styles.stats}>
        <RepositoryStat label='Language' value={language ?? '不明'} />
        <RepositoryStat label='Stars' value={stargazers_count.toLocaleString()} />
        <RepositoryStat label='Watchers' value={watchers_count.toLocaleString()} />
        <RepositoryStat label='Forks' value={forks_count.toLocaleString()} />
        <RepositoryStat label='Issues' value={open_issues_count.toLocaleString()} />
      </dl>
    </article>
  );
}

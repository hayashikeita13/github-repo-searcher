import Image from 'next/image';

import type { GithubRepository } from '@/frontend/api/github/types';
import RepositoryStat from '@/frontend/components/molecules/RepositoryStat';

import styles from './index.module.scss';

type Props = { repository: GithubRepository };

const AVATAR_SIZE = 80;

function avatarWithSize(url: string, size: number) {
  try {
    const u = new URL(url);
    u.searchParams.set('s', String(size * 2));
    return u.toString();
  } catch {
    return url;
  }
}

export default function RepositoryDetail({ repository }: Props) {
  const { owner, full_name, language, stargazers_count, watchers_count, forks_count, open_issues_count } = repository;

  return (
    <article className={styles.root}>
      <header className={styles.header}>
        <Image
          src={avatarWithSize(owner.avatar_url, AVATAR_SIZE)}
          alt={`${owner.login} のアバター`}
          width={AVATAR_SIZE}
          height={AVATAR_SIZE}
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

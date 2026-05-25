import Image from 'next/image';
import Link from 'next/link';

import type { GithubRepositorySummary } from '@/frontend/api/github/types';

import styles from './index.module.scss';

type Props = { repository: GithubRepositorySummary };

const AVATAR_SIZE = 40;

function avatarWithSize(url: string, size: number) {
  try {
    const u = new URL(url);
    u.searchParams.set('s', String(size * 2));
    return u.toString();
  } catch {
    return url;
  }
}

export default function RepositoryCard({ repository }: Props) {
  const { owner, name, full_name } = repository;
  return (
    <Link href={`/repositories/${owner.login}/${name}`} className={styles.root} prefetch={false}>
      <Image
        src={avatarWithSize(owner.avatar_url, AVATAR_SIZE)}
        alt={`${owner.login} のアバター`}
        width={AVATAR_SIZE}
        height={AVATAR_SIZE}
        className={styles.avatar}
      />
      <span className={styles.name}>{full_name}</span>
    </Link>
  );
}

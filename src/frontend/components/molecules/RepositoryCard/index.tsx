import Image from 'next/image';
import Link from 'next/link';

import type { GithubRepository } from '@/frontend/api/github/types';

import styles from './index.module.scss';

type Props = { repository: GithubRepository };

export default function RepositoryCard({ repository }: Props) {
  const { owner, name, full_name } = repository;
  return (
    <Link href={`/repositories/${owner.login}/${name}`} className={styles.root} prefetch={false}>
      <Image
        src={owner.avatar_url}
        alt={`${owner.login} のアバター`}
        width={40}
        height={40}
        className={styles.avatar}
      />
      <span className={styles.name}>{full_name}</span>
    </Link>
  );
}

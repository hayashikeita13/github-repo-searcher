'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';
import { useRepositories } from '@/frontend/contexts/RepositoriesContext';
import RepositoryDetail from '@/frontend/components/organisms/RepositoryDetail';
import styles from './index.module.scss';

type Props = { owner: string; name: string };

export default function RepositoryDetailTemplate({ owner, name }: Props) {
  const { getRepository } = useRepositories();
  const repository = getRepository(owner, name);
  const router = useRouter();

  useEffect(() => {
    if (!repository) router.replace('/');
  }, [repository, router]);

  if (!repository) {
    return (
      <div className={styles.root}>
        <div role='status' aria-live='polite' className={styles.loading}>
          <Spin size='large' />
          <span className={styles.loadingText}>読み込み中…</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <RepositoryDetail repository={repository} />
    </div>
  );
}

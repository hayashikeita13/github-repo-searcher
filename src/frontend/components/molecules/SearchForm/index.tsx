'use client';

import { Button, Input } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './index.module.scss';

export default function SearchForm() {
  const router = useRouter();
  const params = useSearchParams();
  const initialQ = params.get('q') ?? '';

  const handleSearch = (value: string) => {
    const q = value.trim();
    if (!q) return;
    router.push(`/?q=${encodeURIComponent(q)}&page=1`);
  };

  return (
    <div className={styles.root}>
      <Input.Search
        defaultValue={initialQ}
        placeholder='リポジトリを検索'
        enterButton={
          <Button type='primary' autoInsertSpace={false}>
            検索
          </Button>
        }
        size='large'
        aria-label='リポジトリを検索'
        allowClear
        onSearch={handleSearch}
      />
    </div>
  );
}

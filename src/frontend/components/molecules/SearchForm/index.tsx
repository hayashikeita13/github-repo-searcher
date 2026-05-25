'use client';

import { Button, Input } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import styles from './index.module.scss';

export default function SearchForm() {
  const router = useRouter();
  const params = useSearchParams();
  const initialQ = params.get('q') ?? '';

  const [value, setValue] = useState(initialQ);
  const [prevInitialQ, setPrevInitialQ] = useState(initialQ);
  if (initialQ !== prevInitialQ) {
    setPrevInitialQ(initialQ);
    setValue(initialQ);
  }

  const handleSearch = (next: string) => {
    const q = next.trim();
    if (!q) return;
    const search = new URLSearchParams({ q, page: '1' }).toString();
    router.push(`/?${search}`);
  };

  return (
    <div className={styles.root}>
      <Input.Search
        value={value}
        onChange={(e) => setValue(e.target.value)}
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

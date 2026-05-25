'use client';

import { Button, Input } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import styles from './index.module.scss';

function InnerForm({ initialQ }: { initialQ: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialQ);

  const handleSearch = (next: string) => {
    const q = next.trim();
    if (!q) return;
    const search = new URLSearchParams({ q, page: '1' }).toString();
    router.push(`/?${search}`);
  };

  return (
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
  );
}

export default function SearchForm() {
  const params = useSearchParams();
  const initialQ = params.get('q') ?? '';

  return (
    <div className={styles.root}>
      <InnerForm key={initialQ} initialQ={initialQ} />
    </div>
  );
}

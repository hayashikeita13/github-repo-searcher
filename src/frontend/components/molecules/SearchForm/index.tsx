'use client';

import { Button, Input } from 'antd';
import styles from './index.module.scss';

export default function SearchForm() {
  return (
    <div className={styles.root}>
      <Input.Search
        placeholder='リポジトリを検索'
        enterButton={
          <Button type='primary' autoInsertSpace={false}>
            検索
          </Button>
        }
        size='large'
        aria-label='リポジトリを検索'
        allowClear
      />
    </div>
  );
}

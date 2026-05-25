import type { Metadata } from 'next';
import Link from 'next/link';

import styles from './not-found.module.scss';

export const metadata: Metadata = {
  title: 'ページが見つかりません',
};

export default function NotFound() {
  return (
    <div role='alert' className={styles.root}>
      <h2 className={styles.title}>ページが見つかりません</h2>
      <p className={styles.message}>お探しのページは存在しないか、移動された可能性があります。</p>
      <Link href='/' className={styles.link}>
        ホームに戻る
      </Link>
    </div>
  );
}

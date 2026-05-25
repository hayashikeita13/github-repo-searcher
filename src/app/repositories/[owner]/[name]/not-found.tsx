import Link from 'next/link';

import styles from './not-found.module.scss';

export default function NotFound() {
  return (
    <div role='alert' className={styles.root}>
      <h2 className={styles.title}>リポジトリが見つかりません</h2>
      <p className={styles.message}>指定された owner/name のリポジトリは存在しないか、削除された可能性があります。</p>
      <Link href='/' className={styles.link}>
        ホームに戻る
      </Link>
    </div>
  );
}

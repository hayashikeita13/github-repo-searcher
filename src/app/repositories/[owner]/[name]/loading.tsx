import styles from './loading.module.scss';

export default function Loading() {
  return (
    <div role='status' aria-busy='true' className={styles.root}>
      リポジトリ情報を取得中…
    </div>
  );
}

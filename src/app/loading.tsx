import styles from './loading.module.scss';

export default function Loading() {
  return (
    <div role='status' aria-busy='true' className={styles.root}>
      読み込み中…
    </div>
  );
}

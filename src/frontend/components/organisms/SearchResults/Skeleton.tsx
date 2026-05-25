import styles from './index.module.scss';

const SKELETON_COUNT = 5;

export default function SearchResultsSkeleton() {
  return (
    <section className={styles.root}>
      <div className={styles.skeleton} role='status' aria-busy='true' aria-label='読み込み中'>
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <div key={i} className={styles.skeletonItem} />
        ))}
      </div>
    </section>
  );
}

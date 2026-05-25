import { PER_PAGE } from '@/frontend/api/github/constants';

import styles from './index.module.scss';

export default function SearchResultsSkeleton() {
  return (
    <section className={styles.root}>
      <div className={styles.skeleton} role='status' aria-busy='true' aria-label='読み込み中'>
        {Array.from({ length: PER_PAGE }).map((_, i) => (
          <div key={i} className={styles.skeletonItem} />
        ))}
      </div>
    </section>
  );
}

import Link from 'next/link';
import { Suspense } from 'react';

import BrandLink from './BrandLink';
import styles from './index.module.scss';

const BRAND = 'Github Repository Searcher';

export default function Header() {
  return (
    <header className={styles.root}>
      <Suspense
        fallback={
          <Link href='/' className={styles.brandLink}>
            {BRAND}
          </Link>
        }
      >
        <BrandLink>{BRAND}</BrandLink>
      </Suspense>
    </header>
  );
}

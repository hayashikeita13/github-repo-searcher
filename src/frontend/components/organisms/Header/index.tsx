import Link from 'next/link';

import styles from './index.module.scss';

const BRAND = 'Github Repository Searcher';

export default function Header() {
  return (
    <header className={styles.root}>
      <Link href='/' className={styles.brandLink}>
        {BRAND}
      </Link>
    </header>
  );
}

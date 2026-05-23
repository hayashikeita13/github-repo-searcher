import Link from 'next/link';
import styles from './Header.module.scss';

export default function Header() {
  return (
    <header className={styles.root}>
      <Link href='/' className={styles.brandLink}>
        Github Repository Searcher
      </Link>
    </header>
  );
}

'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import styles from './index.module.scss';

type Props = {
  children: React.ReactNode;
};

export default function BrandLink({ children }: Props) {
  const params = useSearchParams();
  const q = params.get('q');
  const href = q ? `/?q=${encodeURIComponent(q)}` : '/';

  return (
    <Link href={href} className={styles.brandLink}>
      {children}
    </Link>
  );
}

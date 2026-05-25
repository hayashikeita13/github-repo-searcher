import type { ReactNode } from 'react';

import SearchForm from '@/frontend/components/molecules/SearchForm';

import styles from './index.module.scss';

type Props = { children: ReactNode };

export default function HomeTemplate({ children }: Props) {
  return (
    <div className={styles.root}>
      <SearchForm />
      {children}
    </div>
  );
}

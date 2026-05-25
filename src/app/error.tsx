'use client';

import { useEffect } from 'react';

import styles from './error.module.scss';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role='alert' className={styles.root}>
      <h2>予期せぬエラーが発生しました</h2>
      <p className={styles.message}>{error.message}</p>
      <button type='button' className={styles.button} onClick={() => reset()}>
        もう一度試す
      </button>
    </div>
  );
}

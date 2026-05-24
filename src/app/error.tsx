'use client';

import { useEffect } from 'react';

type Props = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function Error({ error, unstable_retry }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role='alert' style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>予期せぬエラーが発生しました</h2>
      <p style={{ color: '#6b7280' }}>{error.message}</p>
      <button type='button' onClick={() => unstable_retry()}>
        もう一度試す
      </button>
    </div>
  );
}

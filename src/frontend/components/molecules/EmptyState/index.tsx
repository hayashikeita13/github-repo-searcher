import styles from './index.module.scss';

type Variant = 'initial' | 'no-results' | 'error';

type Props = {
  variant: Variant;
  message?: string;
};

const defaultMessages: Record<Variant, string> = {
  initial: 'キーワードを入力して検索してください',
  'no-results': '該当するリポジトリは見つかりませんでした',
  error: 'エラーが発生しました',
};

export default function EmptyState({ variant, message }: Props) {
  const text = message ?? defaultMessages[variant];
  const className = variant === 'error' ? `${styles.root} ${styles.error}` : styles.root;
  return (
    <div className={className} role={variant === 'error' ? 'alert' : 'status'}>
      {text}
    </div>
  );
}

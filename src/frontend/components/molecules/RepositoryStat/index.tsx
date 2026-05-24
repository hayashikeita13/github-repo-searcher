import styles from './index.module.scss';

type Props = {
  label: string;
  value: string | number;
};

export default function RepositoryStat({ label, value }: Props) {
  return (
    <div className={styles.root}>
      <dt className={styles.label}>{label}</dt>
      <dd className={styles.value}>{value}</dd>
    </div>
  );
}

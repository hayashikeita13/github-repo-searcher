import SearchForm from '@/frontend/components/molecules/SearchForm';
import styles from './index.module.scss';

export default function HomeTemplate() {
  return (
    <div className={styles.root}>
      <SearchForm />
    </div>
  );
}

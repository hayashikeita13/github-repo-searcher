import SearchForm from '@/frontend/components/molecules/SearchForm';
import SearchResults from '@/frontend/components/organisms/SearchResults';

import styles from './index.module.scss';

export default function HomeTemplate() {
  return (
    <div className={styles.root}>
      <SearchForm />
      <SearchResults />
    </div>
  );
}

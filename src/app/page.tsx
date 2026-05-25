import { Suspense } from 'react';

import { SearchUrlQuerySchema } from '@/frontend/api/github/schemas';
import SearchResults from '@/frontend/components/organisms/SearchResults';
import SearchResultsSkeleton from '@/frontend/components/organisms/SearchResults/Skeleton';
import HomeTemplate from '@/frontend/components/templates/HomeTemplate';

type Props = { searchParams: Promise<{ q?: string; page?: string }> };

export default async function Page({ searchParams }: Props) {
  const parsed = SearchUrlQuerySchema.safeParse(await searchParams);
  const { q, page } = parsed.success ? parsed.data : { q: undefined, page: 1 };

  return (
    <HomeTemplate>
      <Suspense key={`${q ?? ''}-${page}`} fallback={<SearchResultsSkeleton />}>
        <SearchResults q={q} page={page} />
      </Suspense>
    </HomeTemplate>
  );
}

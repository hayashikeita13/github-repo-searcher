import { githubFetch, type GithubFetchOptions } from './client';
import { SearchRepositoriesArgsSchema, SearchRepositoriesResponseSchema } from './schemas';
import { GithubApiError, type SearchRepositoriesResponse } from './types';

const ENDPOINT = 'https://api.github.com/search/repositories';

export async function searchRepositories(
  args: unknown,
  opts: GithubFetchOptions = {}
): Promise<SearchRepositoriesResponse> {
  const parsed = SearchRepositoriesArgsSchema.safeParse(args);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? '引数が不正です';
    throw new GithubApiError('validation', msg);
  }

  const { q, page, perPage } = parsed.data;
  const params = new URLSearchParams({ q, page: String(page), per_page: String(perPage) });
  const url = `${ENDPOINT}?${params.toString()}`;

  return githubFetch(url, SearchRepositoriesResponseSchema, opts);
}

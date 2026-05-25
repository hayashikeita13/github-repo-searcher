import { githubFetch, type GithubFetchOptions } from './client';
import { GetRepositoryArgsSchema, GithubRepositorySchema } from './schemas';
import { GithubApiError, type GithubRepository } from './types';

const ENDPOINT = 'https://api.github.com/repos';

export async function getRepository(args: unknown, opts: GithubFetchOptions = {}): Promise<GithubRepository> {
  const parsed = GetRepositoryArgsSchema.safeParse(args);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? '引数が不正です';
    throw new GithubApiError('validation', msg);
  }

  const { owner, name } = parsed.data;
  const url = `${ENDPOINT}/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`;

  return githubFetch(url, GithubRepositorySchema, opts);
}

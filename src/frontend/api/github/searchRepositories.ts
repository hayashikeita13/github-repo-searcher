import { SearchRepositoriesArgsSchema, SearchRepositoriesResponseSchema } from './schemas';
import { GithubApiError, type SearchRepositoriesResponse } from './types';

const ENDPOINT = 'https://api.github.com/search/repositories';

function isAbortError(err: unknown): err is DOMException {
  return err instanceof DOMException && err.name === 'AbortError';
}

function mapHttpStatusToError(res: Response): GithubApiError {
  const status = res.status;
  if (status === 403) {
    const remaining = res.headers.get('X-RateLimit-Remaining');
    if (remaining === '0') {
      return new GithubApiError('rate_limit', 'GitHub API のレート制限に達しました', status);
    }
    return new GithubApiError('forbidden', 'アクセスが拒否されました', status);
  }
  if (status === 422) {
    return new GithubApiError('validation', '検索キーワードが不正です', status);
  }
  if (status === 404) {
    return new GithubApiError('not_found', 'リソースが見つかりません', status);
  }
  if (status >= 500) {
    return new GithubApiError('server', 'GitHub サーバでエラーが発生しました', status);
  }
  return new GithubApiError('unknown', `不明なエラー (status=${status})`, status);
}

export async function searchRepositories(
  args: unknown,
  opts: { signal?: AbortSignal } = {}
): Promise<SearchRepositoriesResponse> {
  const parsed = SearchRepositoriesArgsSchema.safeParse(args);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? '引数が不正です';
    throw new GithubApiError('validation', msg);
  }

  const { q, page, perPage } = parsed.data;
  const params = new URLSearchParams({ q, page: String(page), per_page: String(perPage) });
  const url = `${ENDPOINT}?${params.toString()}`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2026-03-10',
      },
      signal: opts.signal,
      cache: 'no-store',
    });
  } catch (err) {
    if (isAbortError(err)) throw err;
    throw new GithubApiError('network', 'ネットワークエラーが発生しました');
  }

  if (!res.ok) {
    throw mapHttpStatusToError(res);
  }

  const json: unknown = await res.json();
  const responseParsed = SearchRepositoriesResponseSchema.safeParse(json);
  if (!responseParsed.success) {
    throw new GithubApiError('unknown', 'レスポンス形式が不正です');
  }
  return responseParsed.data;
}

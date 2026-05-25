import { GetRepositoryArgsSchema, GithubRepositorySchema } from './schemas';
import { GithubApiError, type GithubRepository } from './types';

const ENDPOINT = 'https://api.github.com/repos';

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
  if (status === 404) {
    return new GithubApiError('not_found', 'リポジトリが見つかりません', status);
  }
  if (status >= 500) {
    return new GithubApiError('server', 'GitHub サーバでエラーが発生しました', status);
  }
  return new GithubApiError('unknown', `不明なエラー (status=${status})`, status);
}

export async function getRepository(
  args: unknown,
  opts: {
    signal?: AbortSignal;
    next?: { revalidate?: number | false; tags?: string[] };
  } = {}
): Promise<GithubRepository> {
  const parsed = GetRepositoryArgsSchema.safeParse(args);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? '引数が不正です';
    throw new GithubApiError('validation', msg);
  }

  const { owner, name } = parsed.data;
  const url = `${ENDPOINT}/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2026-03-10',
      },
      signal: opts.signal,
      ...(opts.next ? { next: opts.next } : { cache: 'no-store' }),
    });
  } catch (err) {
    if (isAbortError(err)) throw err;
    throw new GithubApiError('network', 'ネットワークエラーが発生しました');
  }

  if (!res.ok) {
    throw mapHttpStatusToError(res);
  }

  const json: unknown = await res.json();
  const responseParsed = GithubRepositorySchema.safeParse(json);
  if (!responseParsed.success) {
    throw new GithubApiError('unknown', 'レスポンス形式が不正です');
  }
  return responseParsed.data;
}

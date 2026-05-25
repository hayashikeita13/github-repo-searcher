import type { ZodType } from 'zod';

import { GithubApiError } from './types';

const COMMON_HEADERS = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2026-03-10',
};

export type GithubFetchOptions = {
  signal?: AbortSignal;
  next?: { revalidate?: number | false; tags?: string[] };
};

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
    return new GithubApiError('validation', 'リクエストが不正です', status);
  }
  if (status === 404) {
    return new GithubApiError('not_found', 'リソースが見つかりません', status);
  }
  if (status >= 500) {
    return new GithubApiError('server', 'GitHub サーバでエラーが発生しました', status);
  }
  return new GithubApiError('unknown', `不明なエラー (status=${status})`, status);
}

export async function githubFetch<T>(url: string, schema: ZodType<T>, opts: GithubFetchOptions = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      headers: COMMON_HEADERS,
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
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    throw new GithubApiError('unknown', 'レスポンス形式が不正です');
  }
  return parsed.data;
}

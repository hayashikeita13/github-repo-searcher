import type { z } from 'zod';

import type {
  GetRepositoryArgsSchema,
  GithubOwnerSchema,
  GithubRepositorySchema,
  GithubRepositorySummarySchema,
  SearchRepositoriesArgsSchema,
  SearchRepositoriesResponseSchema,
} from './schemas';

export type GithubOwner = z.infer<typeof GithubOwnerSchema>;
export type GithubRepository = z.infer<typeof GithubRepositorySchema>;
export type GithubRepositorySummary = z.infer<typeof GithubRepositorySummarySchema>;
export type SearchRepositoriesResponse = z.infer<typeof SearchRepositoriesResponseSchema>;
export type SearchRepositoriesArgs = z.infer<typeof SearchRepositoriesArgsSchema>;
export type GetRepositoryArgs = z.infer<typeof GetRepositoryArgsSchema>;

export type GithubErrorKind =
  | 'validation'
  | 'rate_limit'
  | 'forbidden'
  | 'not_found'
  | 'server'
  | 'network'
  | 'unknown';

export class GithubApiError extends Error {
  readonly kind: GithubErrorKind;
  readonly status?: number;

  constructor(kind: GithubErrorKind, message: string, status?: number) {
    super(message);
    this.name = 'GithubApiError';
    this.kind = kind;
    this.status = status;
  }
}

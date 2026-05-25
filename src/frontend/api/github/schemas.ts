import { z } from 'zod';

export const GithubOwnerSchema = z.object({
  login: z.string(),
  avatar_url: z.url(),
});

export const GithubRepositorySchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  owner: GithubOwnerSchema,
  html_url: z.url(),
  language: z.string().nullable(),
  stargazers_count: z.number(),
  watchers_count: z.number(),
  forks_count: z.number(),
  open_issues_count: z.number(),
});

export const SearchRepositoriesResponseSchema = z.object({
  total_count: z.number(),
  incomplete_results: z.boolean(),
  items: z.array(GithubRepositorySchema),
});

export const SearchRepositoriesArgsSchema = z.object({
  q: z.string().trim().min(1, '検索キーワードを入力してください'),
  page: z.number().int().min(1).max(100),
  perPage: z.number().int().min(1).max(100).default(50),
});

export const GetRepositoryArgsSchema = z.object({
  owner: z.string().min(1).max(100),
  name: z.string().min(1).max(100),
});

export const SearchUrlQuerySchema = z.object({
  q: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
});

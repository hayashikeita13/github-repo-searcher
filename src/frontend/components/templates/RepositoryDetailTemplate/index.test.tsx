import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { GithubRepository } from '@/frontend/api/github/types';

import RepositoryDetailTemplate from './index';

const baseRepo: GithubRepository = {
  id: 1,
  name: 'next.js',
  full_name: 'vercel/next.js',
  owner: { login: 'vercel', avatar_url: 'https://avatars.githubusercontent.com/u/14985020?v=4' },
  html_url: 'https://github.com/vercel/next.js',
  language: 'JavaScript',
  stargazers_count: 100,
  watchers_count: 50,
  forks_count: 25,
  open_issues_count: 10,
};

describe('RepositoryDetailTemplate', () => {
  it('props で受け取った repository を RepositoryDetail に渡して表示する', () => {
    render(<RepositoryDetailTemplate repository={baseRepo} />);

    expect(screen.getByRole('heading', { name: 'vercel/next.js' })).toBeInTheDocument();
    expect(screen.getByAltText('vercel のアバター')).toBeInTheDocument();
  });
});

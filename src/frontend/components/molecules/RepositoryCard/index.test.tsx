import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { GithubRepository } from '@/frontend/api/github/types';

import RepositoryCard from './index';

const repo: GithubRepository = {
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

describe('RepositoryCard', () => {
  it('full_name を表示する', () => {
    render(<RepositoryCard repository={repo} />);
    expect(screen.getByText('vercel/next.js')).toBeInTheDocument();
  });

  it('avatar 画像が alt 付きで表示される', () => {
    render(<RepositoryCard repository={repo} />);
    const img = screen.getByAltText('vercel のアバター');
    expect(img).toBeInTheDocument();
  });

  it('リンク先が /repositories/<owner>/<name> になっている', () => {
    render(<RepositoryCard repository={repo} />);
    const link = screen.getByRole('link', { name: /vercel\/next\.js/ });
    expect(link).toHaveAttribute('href', '/repositories/vercel/next.js');
  });
});

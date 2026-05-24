import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { GithubRepository } from '@/frontend/api/github/types';

import RepositoryDetail from './index';

const baseRepo: GithubRepository = {
  id: 1,
  name: 'next.js',
  full_name: 'vercel/next.js',
  owner: { login: 'vercel', avatar_url: 'https://avatars.githubusercontent.com/u/14985020?v=4' },
  html_url: 'https://github.com/vercel/next.js',
  language: 'JavaScript',
  stargazers_count: 12345,
  watchers_count: 678,
  forks_count: 90,
  open_issues_count: 7,
};

describe('RepositoryDetail', () => {
  it('full_name を見出しとして表示', () => {
    render(<RepositoryDetail repository={baseRepo} />);
    expect(screen.getByRole('heading', { name: 'vercel/next.js' })).toBeInTheDocument();
  });

  it('avatar 画像が alt 付きで表示される', () => {
    render(<RepositoryDetail repository={baseRepo} />);
    expect(screen.getByAltText('vercel のアバター')).toBeInTheDocument();
  });

  it('language / stars / watchers / forks / issues を表示', () => {
    render(<RepositoryDetail repository={baseRepo} />);
    expect(screen.getByText('Language')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('Stars')).toBeInTheDocument();
    expect(screen.getByText('12,345')).toBeInTheDocument();
    expect(screen.getByText('Watchers')).toBeInTheDocument();
    expect(screen.getByText('678')).toBeInTheDocument();
    expect(screen.getByText('Forks')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
    expect(screen.getByText('Issues')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('language が null のとき「不明」と表示', () => {
    render(<RepositoryDetail repository={{ ...baseRepo, language: null }} />);
    expect(screen.getByText('不明')).toBeInTheDocument();
  });
});

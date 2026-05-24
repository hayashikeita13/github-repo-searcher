import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { GithubRepository } from '@/frontend/api/github/types';

import RepositoryList from './index';

const makeRepo = (id: number, login: string, name: string): GithubRepository => ({
  id,
  name,
  full_name: `${login}/${name}`,
  owner: { login, avatar_url: `https://avatars.githubusercontent.com/u/${id}?v=4` },
  html_url: `https://github.com/${login}/${name}`,
  language: 'TypeScript',
  stargazers_count: 1,
  watchers_count: 1,
  forks_count: 1,
  open_issues_count: 1,
});

describe('RepositoryList', () => {
  it('items を渡した数だけ Card が並ぶ', () => {
    const items = [makeRepo(1, 'a', 'x'), makeRepo(2, 'b', 'y'), makeRepo(3, 'c', 'z')];
    render(<RepositoryList items={items} />);
    expect(screen.getAllByRole('link')).toHaveLength(3);
  });

  it('items=[] で link が描画されない', () => {
    render(<RepositoryList items={[]} />);
    expect(screen.queryByRole('link')).toBeNull();
  });
});

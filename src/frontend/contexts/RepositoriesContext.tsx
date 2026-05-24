'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { GithubRepository } from '@/frontend/api/github/types';

type Key = `${string}/${string}`;

const makeKey = (owner: string, name: string): Key => `${owner}/${name}`;

type ContextValue = {
  saveRepositories: (items: GithubRepository[]) => void;
  getRepository: (owner: string, name: string) => GithubRepository | undefined;
};

const RepositoriesContext = createContext<ContextValue | null>(null);

export function RepositoriesProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<Map<Key, GithubRepository>>(() => new Map());

  const saveRepositories = useCallback((items: GithubRepository[]) => {
    setMap((prev) => {
      const next = new Map(prev);
      for (const repo of items) {
        next.set(makeKey(repo.owner.login, repo.name), repo);
      }
      return next;
    });
  }, []);

  const getRepository = useCallback((owner: string, name: string) => map.get(makeKey(owner, name)), [map]);

  const value = useMemo<ContextValue>(() => ({ saveRepositories, getRepository }), [saveRepositories, getRepository]);

  return <RepositoriesContext.Provider value={value}>{children}</RepositoriesContext.Provider>;
}

export function useRepositories(): ContextValue {
  const ctx = useContext(RepositoriesContext);
  if (!ctx) {
    throw new Error('useRepositories must be used within RepositoriesProvider');
  }
  return ctx;
}

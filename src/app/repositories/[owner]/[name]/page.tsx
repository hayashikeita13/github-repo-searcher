import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getRepository } from '@/frontend/api/github/getRepository';
import { GetRepositoryArgsSchema } from '@/frontend/api/github/schemas';
import { GithubApiError } from '@/frontend/api/github/types';
import RepositoryDetailTemplate from '@/frontend/components/templates/RepositoryDetailTemplate';

type Props = { params: Promise<{ owner: string; name: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const parsed = GetRepositoryArgsSchema.safeParse(await params);
  if (!parsed.success) return {};
  const { owner, name } = parsed.data;
  const fullName = `${owner}/${name}`;
  const fallbackDescription = `GitHub リポジトリ ${fullName} の詳細情報（スター数・言語・説明など）を表示します。`;

  try {
    const repository = await getRepository(parsed.data, { next: { revalidate: 300 } });
    const description = repository.description ?? fallbackDescription;
    return {
      title: repository.full_name,
      description,
      openGraph: {
        title: repository.full_name,
        description,
        type: 'article',
        images: [{ url: repository.owner.avatar_url }],
      },
      twitter: {
        card: 'summary',
        title: repository.full_name,
        description,
        images: [repository.owner.avatar_url],
      },
    };
  } catch {
    return {
      title: fullName,
      description: fallbackDescription,
      openGraph: { title: fullName, description: fallbackDescription, type: 'article' },
      twitter: { card: 'summary', title: fullName, description: fallbackDescription },
    };
  }
}

export default async function Page({ params }: Props) {
  const parsed = GetRepositoryArgsSchema.safeParse(await params);
  if (!parsed.success) notFound();

  let repository;
  try {
    repository = await getRepository(parsed.data, { next: { revalidate: 300 } });
  } catch (err) {
    if (err instanceof GithubApiError && err.kind === 'not_found') {
      notFound();
    }
    throw err;
  }

  return <RepositoryDetailTemplate repository={repository} />;
}

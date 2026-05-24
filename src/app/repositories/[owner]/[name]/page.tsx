import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import RepositoryDetailTemplate from '@/frontend/components/templates/RepositoryDetailTemplate';

const ParamsSchema = z.object({
  owner: z.string().min(1).max(100),
  name: z.string().min(1).max(100),
});

type Props = { params: Promise<{ owner: string; name: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const parsed = ParamsSchema.safeParse(await params);
  if (!parsed.success) return {};
  const { owner, name } = parsed.data;
  const fullName = `${owner}/${name}`;
  const description = `GitHub リポジトリ ${fullName} の詳細情報（スター数・言語・説明など）を表示します。`;
  return {
    title: fullName,
    description,
    openGraph: {
      title: fullName,
      description,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: fullName,
      description,
    },
  };
}

export default async function Page({ params }: Props) {
  const parsed = ParamsSchema.safeParse(await params);
  if (!parsed.success) notFound();
  return <RepositoryDetailTemplate owner={parsed.data.owner} name={parsed.data.name} />;
}

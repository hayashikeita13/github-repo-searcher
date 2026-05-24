import { notFound } from 'next/navigation';
import { z } from 'zod';
import RepositoryDetailTemplate from '@/frontend/components/templates/RepositoryDetailTemplate';

const ParamsSchema = z.object({
  owner: z.string().min(1).max(100),
  name: z.string().min(1).max(100),
});

type Props = { params: Promise<{ owner: string; name: string }> };

export default async function Page({ params }: Props) {
  const parsed = ParamsSchema.safeParse(await params);
  if (!parsed.success) notFound();
  return <RepositoryDetailTemplate owner={parsed.data.owner} name={parsed.data.name} />;
}

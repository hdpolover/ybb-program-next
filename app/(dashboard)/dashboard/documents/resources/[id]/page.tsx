import ProgramResourceDetailSection from '@/components/dashboard/sections/ProgramResourceDetailSection';

export default async function ProgramResourceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ProgramResourceDetailSection resourceId={id} />;
}

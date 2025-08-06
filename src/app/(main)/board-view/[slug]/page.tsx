import BoardView from '@/components/BoardView';
import { TaskProvider } from '@/components/TaskContext';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  return {
    title: `Board View: ${params.slug}`,
    description: 'This is todo list admin dashboard',
  };
}

interface BoardPageProps {
  params: { slug: string };
}

export default function BoardViewPage({ params }: BoardPageProps) {
  return (
    <TaskProvider boardId={params.slug}>
      <BoardView />
    </TaskProvider>
  );
}

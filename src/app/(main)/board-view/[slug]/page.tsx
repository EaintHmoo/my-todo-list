import BoardView from '@/components/BoardView';
import { getBoardById } from '@/libs/board';
import { TaskProvider } from '@/store/TaskContext';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const board = await getBoardById(params.slug);
  return {
    title: `${board?.title || 'Board View'}`,
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


import BoardView from '@/components/BoardView';
import { TaskProvider } from '@/components/TaskProvider';
import { Task } from '@/model/task';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Borad View List',
  description:
    'This is board view list of home',
}

// Mock Data
const initialTasks:Array<Task> = [];

export default function App() {
    return <>
      <TaskProvider boardId='123' initialBoardTitle='Default Board View'>
        <BoardView />
      </TaskProvider>

    </>
}

import Dashboard from '@/components/Dashboard';
import { TaskProvider } from '@/components/TaskProvider';
import { Task } from '@/model/task';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Todo List',
  description:
    'This is todo list admin dashboard',
}

// Mock Data
const initialTasks:Array<Task> = [
  { id: 'task-1', name: 'Finalize presentation for the quarterly meeting', priority: 'High', dueDate: '2024-07-25', status: 'in_progress' },
  { id: 'task-2', name: 'Develop the new user authentication flow', priority: 'High', dueDate: '2024-07-28', status: 'in_progress' },
  { id: 'task-3', name: 'Design the landing page mockup', priority: 'Medium', dueDate: '2024-07-30', status: 'not_started' },
  { id: 'task-4', name: 'Fix the bug in the payment processing module', priority: 'High', dueDate: '2024-07-24', status: 'done' },
  { id: 'task-5', name: 'Write documentation for the new API endpoints', priority: 'Low', dueDate: '2024-08-05', status: 'not_started' },
  { id: 'task-6', name: 'Team brainstorming session for Q3 goals', priority: 'Medium', dueDate: '2024-07-26', status: 'not_started' },
];

export default function App() {
    return <>
      <TaskProvider initialTasks={initialTasks}>
        <Dashboard />
      </TaskProvider>

    </>
}
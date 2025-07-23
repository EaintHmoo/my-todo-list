
import Dashboard from '@/components/Dashboard';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Todo List',
  description:
    'This is todo list admin dashboard',
}

export default function App() {
    return <>
      <Dashboard/>
    </>
}
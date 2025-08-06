import Home from '@/components/Home';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Borad View List',
  description:
    'This is board view list of home',
}


export default function App() {
  return (
    <>
      <Home/>
    </>
  );
}
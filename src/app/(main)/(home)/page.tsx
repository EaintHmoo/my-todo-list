"use client"
import BoardCard from '@/components/BoardCard';
import Head from 'next/head';
import { useState } from 'react';


// export const metadata: Metadata = {
//   title: 'Borad View List',
//   description:
//     'This is board view list of home',
// }


export default function App() {
   // State for the boards, initialized with some examples
  const [boards, setBoards] = useState([
    { id: 1, title: 'Project Roadmap' },
    { id: 2, title: 'Team Meeting Notes' },
    { id: 3, title: 'Q3 Marketing Plan' },
  ]);

  const handleAddBoard = () => {
    const newBoardTitle = prompt("Enter the new board's title:");
    if (newBoardTitle) {
      const newBoard = {
        id: Date.now(), // Use a timestamp for a more unique key
        title: newBoardTitle,
      };
      setBoards([...boards, newBoard]);
    }
  };

  return (
    // Main container with a light gray background and padding
    <div className="min-h-screen p-8 font-sans">
      <Head>
        <title>My Home</title>
        <meta name="description" content="Notion-style dashboard with Tailwind" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-zinc-900 mb-8">Home ✨</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">          {boards.map((board) => (
            <BoardCard key={board.id} title={board.title} />
          ))}
          <button
            onClick={handleAddBoard}
            className="flex items-center justify-center p-4 text-base font-medium text-zinc-600 bg-white border-2 border-dashed border-zinc-300 rounded-lg cursor-pointer transition-colors hover:bg-zinc-200 hover:border-zinc-400"
          >
            + Add Board View
          </button>
        </div>
      </main>
    </div>
  );
}
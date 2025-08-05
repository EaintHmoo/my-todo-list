"use client"
import BoardCard from '@/components/BoardCard';
import { useBoard } from '@/components/BoardContext';
import Head from 'next/head';

export default function Home() {
  const { boards,createBoard } = useBoard();


  const handleAddBoard = () => {
    const newBoardTitle = prompt("Enter the new board's title:");
    if (newBoardTitle) {
      createBoard(newBoardTitle);
    }
  };

  return (
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
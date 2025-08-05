"use client";
import React, { useState } from 'react';
import { ChevronDown, Search, Bell, Menu } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Image from 'next/image';
import avatorImage from '@/images/avatar.jpg';
import { BoardProvider } from '@/components/BoardContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
    
  return (
    <BoardProvider>
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
        <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-[75px] p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden mr-4 text-gray-600"><Menu size={24} /></button>
            <div className="relative hidden md:block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="text" placeholder="Search tasks..." className="w-full md:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
            </div>
            <div className="flex items-center space-x-5">
            <button className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full"><Bell size={22} /></button>
            <div className="flex items-center space-x-2">
            <Image 
            src={avatorImage} 
            sizes="(min-width: 1024px) 32rem, 20rem"
            alt="User Avatar" 
            className="w-10 h-10 rounded-full" />
                <div><p className="font-semibold text-sm text-gray-800">Admin User</p><p className="text-xs text-gray-500">admin@example.com</p></div><ChevronDown size={18} className="text-gray-500 cursor-pointer" /></div>
            </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
            {children}
        </main>
        </div>
    </div>
    </BoardProvider>
  );
}

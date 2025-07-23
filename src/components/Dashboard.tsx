"use client";
import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from '@dnd-kit/core';
import { ChevronDown, Search, Bell, Plus, CheckCircle, Clock, List, Menu } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { getTasksByStatus } from '@/libs/task';
import { Column, ColumnId, Task } from '@/model/task';
import StatCard from '@/components/StartCard';
import KanbanColumn from '@/components/KanbanColumn';
import KanbanTaskCard from '@/components/KanbanTaskCard';


// Mock Data
const initialTasks:Array<Task> = [
  { id: 'task-1', name: 'Finalize presentation for the quarterly meeting', priority: 'High', dueDate: '2024-07-25', status: 'in_progress' },
  { id: 'task-2', name: 'Develop the new user authentication flow', priority: 'High', dueDate: '2024-07-28', status: 'in_progress' },
  { id: 'task-3', name: 'Design the landing page mockup', priority: 'Medium', dueDate: '2024-07-30', status: 'not_started' },
  { id: 'task-4', name: 'Fix the bug in the payment processing module', priority: 'High', dueDate: '2024-07-24', status: 'done' },
  { id: 'task-5', name: 'Write documentation for the new API endpoints', priority: 'Low', dueDate: '2024-08-05', status: 'not_started' },
  { id: 'task-6', name: 'Team brainstorming session for Q3 goals', priority: 'Medium', dueDate: '2024-07-26', status: 'not_started' },
];

export default function Dashboard(){
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [columns, setColumns] = useState<Record<ColumnId, Column>>(getTasksByStatus(initialTasks));
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
  
    const allTasks = Object.values(columns).flatMap(col => col.tasks);
  
    function handleDragStart(event: DragStartEvent) {
      setActiveTask(event.active.data.current?.task);
    }
  
    function handleDragEnd(event: DragEndEvent) {
      const { active, over } = event;
      setActiveTask(null);
  
      if (over && active.id !== over.id) {
        const activeTask = tasks.find(t => t.id === active.id);
        const newStatus = over.id as Task['status'];
  
        if (activeTask?.status !== newStatus) {
          const updatedTasks = tasks.map(t =>
            t.id === active.id ? { ...t, status: newStatus } : t
          );
          setTasks(updatedTasks);
          setColumns(getTasksByStatus(updatedTasks));
        }
      }
    }
  
    const completedTasks = allTasks.filter(t => t.status === 'done').length;
    const pendingTasks = allTasks.filter(t => t.status !== 'done').length;
    const overdueTasks = allTasks.filter(t => t.status !== 'done' && new Date(t.dueDate) < new Date()).length;
  
    return (
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
          <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center">
                <button onClick={() => setSidebarOpen(true)} className="md:hidden mr-4 text-gray-600"><Menu size={24} /></button>
                <div className="relative hidden md:block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="text" placeholder="Search tasks..." className="w-full md:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
              </div>
              <div className="flex items-center space-x-5">
                <button className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full"><Bell size={22} /></button>
                <div className="flex items-center space-x-2"><img src="https://placehold.co/40x40/6366f1/ffffff?text=A" alt="User Avatar" className="w-10 h-10 rounded-full" /><div><p className="font-semibold text-sm text-gray-800">Admin User</p><p className="text-xs text-gray-500">admin@example.com</p></div><ChevronDown size={18} className="text-gray-500 cursor-pointer" /></div>
              </div>
            </header>
  
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6"><h1 className="text-3xl font-bold text-gray-800">Board View</h1><button className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"><Plus size={20} className="mr-2" /> Add New Task</button></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard icon={<List size={24} className="text-blue-600" />} title="Total Tasks" value={allTasks.length} color="bg-blue-100" />
                <StatCard icon={<CheckCircle size={24} className="text-green-600" />} title="Completed" value={completedTasks} color="bg-green-100" />
                <StatCard icon={<Clock size={24} className="text-yellow-600" />} title="Pending" value={pendingTasks} color="bg-yellow-100" />
                <StatCard icon={<Bell size={24} className="text-red-600" />} title="Overdue" value={overdueTasks} color="bg-red-100" />
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                  {Object.values(columns).map((column) => (
                      <KanbanColumn key={column.id} column={column} tasks={column.tasks} />
                  ))}
              </div>
            </main>
          </div>
          <DragOverlay>
              {activeTask ? <KanbanTaskCard task={activeTask} isDragging /> : null}
          </DragOverlay>
        </div>
      </DndContext>
    );
}
"use client";
import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from '@dnd-kit/core';
import {  Bell, Plus, CheckCircle, Clock, List} from 'lucide-react';
import { getTasksByStatus } from '@/libs/task';
import { Column, ColumnId, Task, TaskForm } from '@/model/task';
import StatCard from '@/components/StartCard';
import KanbanColumn from '@/components/KanbanColumn';
import KanbanTaskCard from '@/components/KanbanTaskCard';
import TaskModal from './TaskModal';


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
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [open, setOpen] = useState(true)
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

    const handleAddNewTask = (newTask: Task) => {
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      setColumns(getTasksByStatus(updatedTasks));
    };
    
  
    const completedTasks = allTasks.filter(t => t.status === 'done').length;
    const pendingTasks = allTasks.filter(t => t.status !== 'done').length;
    const overdueTasks = allTasks.filter(t => t.status !== 'done' && new Date(t.dueDate) < new Date()).length;
  
    return (
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
        <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Board View</h1>
        <button 
        onClick={()=>setOpen(true)}
        className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
          <Plus size={20} className="mr-2" /> Add New Task
          </button>
        </div>
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
        <DragOverlay>
              {activeTask ? <KanbanTaskCard task={activeTask} isDragging /> : null}
        </DragOverlay>
        <TaskModal handleAddNewTask={handleAddNewTask} open={open} setOpen={setOpen}/>
      </DndContext>
    );
}
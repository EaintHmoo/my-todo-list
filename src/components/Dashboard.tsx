"use client";
import React, { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
} from "@dnd-kit/core";
import { Bell, Plus, CheckCircle, Clock, List } from "lucide-react";
import { getTasksByStatus } from "@/libs/task";
import { Column, ColumnId, Task } from "@/model/task";
import StatCard from "@/components/StartCard";
import KanbanColumn from "@/components/KanbanColumn";
import KanbanTaskCard from "@/components/KanbanTaskCard";
import TaskModal from "./TaskModal";
import { useTask } from "./TaskProvider";

export default function Dashboard() {
  const {
    tasks,
    onEdit,
  } = useTask();

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [open, setOpen] = useState(false);

  const columns: Record<ColumnId, Column> = useMemo(
    () => getTasksByStatus(tasks),
    [tasks]
  );

  const allTasks = useMemo(
    () => Object.values(columns).flatMap((col) => col.tasks),
    [columns]
  );

  const completedTasks = allTasks.filter((t) => t.status === "done").length;
  const pendingTasks = allTasks.filter((t) => t.status !== "done").length;
  const overdueTasks = allTasks.filter(
    (t) => t.status !== "done" && new Date(t.dueDate) < new Date()
  ).length;

  function handleDragStart(event: DragStartEvent) {
    setActiveTask(event.active.data.current?.task);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);

    if (over && active.id !== over.id) {
      const draggedTask = tasks.find((t) => t.id === active.id);
      const newStatus = over.id as Task["status"];

      if (draggedTask && draggedTask.status !== newStatus) {
        const updatedTask = { ...draggedTask, status: newStatus };
        onEdit(updatedTask);
      }
    }
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCorners}
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Board View</h1>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} className="mr-2" /> Add New Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          icon={<List size={24} className="text-blue-600" />}
          title="Total Tasks"
          value={allTasks.length}
          color="bg-blue-100"
        />
        <StatCard
          icon={<CheckCircle size={24} className="text-green-600" />}
          title="Completed"
          value={completedTasks}
          color="bg-green-100"
        />
        <StatCard
          icon={<Clock size={24} className="text-yellow-600" />}
          title="Pending"
          value={pendingTasks}
          color="bg-yellow-100"
        />
        <StatCard
          icon={<Bell size={24} className="text-red-600" />}
          title="Overdue"
          value={overdueTasks}
          color="bg-red-100"
        />
      </div>

      <div className="flex flex-row gap-6 overflow-x-auto">
        {Object.values(columns).map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={column.tasks}
            setOpen={setOpen}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <KanbanTaskCard
            task={activeTask}
            isDragging
            setOpen={setOpen}
          />
        ) : null}
      </DragOverlay>

      <TaskModal
        open={open}
        setOpen={setOpen}
      />
    </DndContext>
  );
}

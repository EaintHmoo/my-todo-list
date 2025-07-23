"use client";
import { Task } from "@/model/task";
import { PriorityBadge } from "./PriorityBadge";
import { useDraggable } from '@dnd-kit/core';
import { Calendar } from 'lucide-react';
import { useEffect, useState } from "react";

type KanbanTaskCardProps = {
    task: Task;
    isDragging?: boolean;
};

export default function KanbanTaskCard({ task, isDragging }: KanbanTaskCardProps) {

    const [hasMounted, setHasMounted] = useState(false);

    // ✅ Always call hooks
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task.id,
        data: { task },
    });

    useEffect(() => {
        setHasMounted(true);
    }, []);

    // ✅ Avoid rendering interactive content before client mounts
    if (!hasMounted) return null;

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`bg-white p-4 mb-3 rounded-lg shadow-sm border border-gray-200 cursor-grab ${isDragging ? 'opacity-50 shadow-lg' : 'opacity-100'}`}
        >
            <h4 className="font-semibold text-gray-800 mb-2">{task.name}</h4>
            <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500">
                    <Calendar size={14} className="mr-1.5" />
                    <span suppressHydrationWarning>{task.dueDate}</span>
                </div>
                <PriorityBadge priority={task.priority} />
            </div>
        </div>
    );
}

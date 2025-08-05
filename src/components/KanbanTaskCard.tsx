"use client";
import { Task } from "@/model/task";
import { PriorityBadge } from "./PriorityBadge";
import { useDraggable } from '@dnd-kit/core';
import { Calendar, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from "react";
import { useTask } from "./TaskContext";

interface KanbanTaskCardProps{
    task: Task;
    isDragging?: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenDelete: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function KanbanTaskCard({ task, isDragging, setOpen, setOpenDelete }: KanbanTaskCardProps) {
    const [hasMounted, setHasMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // 1. State for dropdown visibility
    const menuRef = useRef<HTMLDivElement>(null); // Ref for the menu container

    const {
    setEditTask,
    setDeleteTask,
    } = useTask();

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task.id,
        data: { task },
    });

    useEffect(() => {
        setHasMounted(true);
    }, []);

    // 2. Effect to close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    if (!hasMounted) return null;

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    const handleMenuToggle = (e: React.MouseEvent) => {
        setIsMenuOpen(prev => !prev);
    };

    const handleEdit = (e: React.MouseEvent) => {
        console.log("Editing task:", task.id);
        setEditTask(task);
        setIsMenuOpen(false); // Close menu after action
        setOpen(true);
    };

    const handleDelete = (e: React.MouseEvent) => {
        console.log("Deleting task:", task.id);
        setDeleteTask(task);
        setIsMenuOpen(false); // Close menu after action
        setOpenDelete(true);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`group bg-white p-4 mb-3 rounded-lg shadow-sm border border-gray-200 cursor-grab ${isDragging ? 'opacity-50 shadow-lg' : 'opacity-100'}`}
        >
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-800">{task.name}</h4>
                
                {/* 3. Three-dot menu container */}
                <div ref={menuRef} className="relative">
                    <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={handleMenuToggle}
                        className="p-1 text-gray-500 hover:bg-gray-200 rounded-full opacity-100 transition-opacity"
                        aria-label="Task options"
                    >
                        <MoreVertical size={16} />
                    </button>

                    {/* 4. Dropdown Menu */}
                    {isMenuOpen && (
                        <div 
                        onPointerDown={(e) => e.stopPropagation()}
                        className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-xl z-20 border border-gray-100">
                            <ul className="py-1">
                                <li>
                                    <button
                                        onClick={handleEdit}
                                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <Pencil size={14} className="mr-3" />
                                        Edit
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={handleDelete}
                                        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 size={14} className="mr-3" />
                                        Delete
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Rest of the card content */}
            <div className="flex justify-between items-center mt-auto">
                <div className="flex items-center text-sm text-gray-500">
                    <Calendar size={14} className="mr-1.5" />
                    <span suppressHydrationWarning>{task.dueDate}</span>
                </div>
                <PriorityBadge priority={task.priority} />
            </div>
        </div>
    );
}

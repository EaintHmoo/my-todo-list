// Droppable Column Component

import { ColumnId, Task } from "@/model/task";
import KanbanTaskCard from "./KanbanTaskCard";
import { useDroppable } from '@dnd-kit/core';


interface KanbanColumnProps{
    tasks: Array<Task>;
    column: {
        id: ColumnId;
        name: string;
    };
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
};

export default function KanbanColumn({ column, tasks, onEdit, onDelete }: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({ id: column.id });
    const columnStyles = {
        not_started: 'border-t-4 border-t-gray-400',
        in_progress: 'border-t-4 border-t-blue-500',
        done: 'border-t-4 border-t-green-500',
    };

    return (
        <div ref={setNodeRef} className={`bg-gray-100 rounded-lg p-4 w-full md:w-1/3 transition-colors ${isOver ? 'bg-indigo-100' : ''}`}>
            <h3 className={`text-lg font-semibold text-gray-700 mb-4 pb-2 ${columnStyles[column.id]}`}>{column.name} ({tasks.length})</h3>
            <div className="space-y-3">
                {tasks.map(task => (
                    <KanbanTaskCard onEdit={onEdit} onDelete={onDelete} key={task.id} task={task} />
                ))}
            </div>
        </div>
    );
};

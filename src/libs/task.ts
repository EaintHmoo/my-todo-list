import { ColumnId,Column, Task } from "@/model/task";

// Function to organize tasks into columns
export const getTasksByStatus = (tasks:Array<Task>): Record<ColumnId, Column> => {
    const columns: Record<ColumnId, Column> = {
        not_started: { id: 'not_started', name: 'Not Started', tasks: [] },
        in_progress: { id: 'in_progress', name: 'In Progress', tasks: [] },
        done: { id: 'done', name: 'Done', tasks: [] },
    };
    tasks.forEach((task)=> {
        if (columns[task.status]) {
            columns[task.status].tasks.push(task);
        }
    });
    return columns;
};
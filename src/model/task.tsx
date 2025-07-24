export interface Task{
    id: string;
    name: string;
    dueDate: string;
    priority: Priority;
    status: ColumnId;
}

export type Priority = 'High' | 'Medium' | 'Low';

export type ColumnId = 'not_started' | 'in_progress' | 'done';

export type Column = {
    id: ColumnId;
    name: string;
    tasks: Task[];
};

export interface TaskForm{
    priority: Priority | '';
    description: string | '';
    datetime: string | '';
}
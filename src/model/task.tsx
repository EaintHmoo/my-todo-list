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
    id: string |'';
    priority: Priority | '';
    description: string | '';
    dueDate: string | '';
    status: ColumnId;
}

export interface TaskState {
  boardId: string;
  boardTitle?: string;
  tasks: Task[];
  editTask: Task | null;
  deleteTask: Task | null;
  loading?: boolean;
}

export type Action =
  | { type: ActionKind.ADD; payload: Task }
  | { type: ActionKind.EDIT; payload: Task }
  | { type: ActionKind.DELETE; payload: Task }
  | { type: 'SET_EDIT_TASK'; payload: Task | null }
  | { type: 'SET_DELETE_TASK'; payload: Task | null }
  | { type: 'RESET'; payload: TaskState };

export interface PublicTaskActions {
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onAdd: (task: Task) => void;
  setEditTask: (task: Task) => void;
  setDeleteTask: (task?: Task) => void;
  clearEditTask: () => void;
  clearDeleteTask: () => void;
}

export const enum ActionKind {
  ADD = 'ADD',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  SET_EDIT_TASK = 'SET_EDIT_TASK',
  SET_DELETE_TASK = 'SET_DELETE_TASK',
  RESET = 'RESET',
}

export type TaskAPI = TaskState & PublicTaskActions;

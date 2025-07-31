"use client";

import { Task } from "@/model/task";
import {  createContext, useContext, useMemo, useReducer } from "react";

interface TaskState {
    tasks: Task[];
    editTask: Task | null;
    deleteTask: Task | null;
  }
  
  type Action =
    | { type: ActionKind.ADD; payload: Task }
    | { type: ActionKind.EDIT; payload: Task }
    | { type: ActionKind.DELETE; payload: Task }
    | { type: 'SET_EDIT_TASK'; payload: Task | null }
    | { type: 'SET_DELETE_TASK'; payload: Task | null };
  

interface PublicTaskActions {
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
    onAdd: (task?: Task) => void;
    setEditTask: (task?: Task) => void;
    setDeleteTask: (task?: Task) => void;
    clearEditTask: () => void;
    clearDeleteTask: () => void;
}

export type TaskAPI = TaskState & PublicTaskActions

const enum ActionKind {
    ADD = 'ADD',
    EDIT = 'EDIT',
    DELETE = 'DELETE',
    SET_EDIT_TASK = 'SET_EDIT_TASK',
    SET_DELETE_TASK = 'SET_DELETE_TASK',
}

const TaskContext = createContext<TaskAPI | null>(null)

function taskReducer(state: TaskState, action: Action): TaskState {
    switch (action.type) {
      case ActionKind.ADD:
        return { ...state, tasks: [...state.tasks, action.payload] };
      case ActionKind.EDIT:
        return {
          ...state,
          tasks: state.tasks.map(task =>
            task.id === action.payload.id ? action.payload : task
          ),
          editTask: null,
        };
      case ActionKind.DELETE:
        return {
          ...state,
          tasks: state.tasks.filter(task => task.id !== action.payload.id),
          deleteTask: null,
        };
      case ActionKind.SET_EDIT_TASK:
        return { ...state, editTask: action.payload };
      case ActionKind.SET_DELETE_TASK:
        return { ...state, deleteTask: action.payload };
      default:
        return state;
    }
}

export function TaskProvider({ children, initialTasks = [] }: { children: React.ReactNode, initialTasks?: Task[] }) {
  let [state, dispatch] = useReducer(taskReducer, {
    tasks: initialTasks,
    editTask: null,
    deleteTask: null,
  });

  let actions = useMemo<PublicTaskActions>(() => {
    return {
      onEdit(task) {
        if (task) dispatch({ type: ActionKind.EDIT, payload: task });
      },
      onDelete(task) {
        if (task) dispatch({ type: ActionKind.DELETE, payload: task });
      },
      onAdd(task) {
        if (task) dispatch({ type: ActionKind.ADD, payload: task });
      },
      setEditTask(task) {
        if (task) dispatch({ type: ActionKind.SET_EDIT_TASK, payload: task });
      },
      setDeleteTask(task) {
        if (task) dispatch({ type: ActionKind.SET_DELETE_TASK, payload: task });
      },
      clearEditTask() {
        dispatch({ type: ActionKind.SET_EDIT_TASK, payload: null });
      },
      clearDeleteTask() {
        dispatch({ type: ActionKind.SET_DELETE_TASK, payload: null });
      },      
    };
  }, []);
  

  let api = useMemo<TaskAPI>(
    () => ({ ...state, ...actions }),
    [state, actions],
  )

  return (
    <>
      <TaskContext.Provider value={api}>
        {children}
      </TaskContext.Provider>
    </>
  )
}

export function useTask(): TaskAPI {
    const context = useContext(TaskContext);
    if (!context) throw new Error("useTask must be used within TaskProvider");
    return context;
  }
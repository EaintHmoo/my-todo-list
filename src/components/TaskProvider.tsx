"use client";

import { Task } from "@/model/task";
import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { doc, getDocs, setDoc, onSnapshot, collection } from "firebase/firestore";
import { db } from "@/libs/firebase";

interface TaskState {
  boardId: string;
  boardTitle: string;
  tasks: Task[];
  editTask: Task | null;
  deleteTask: Task | null;
  loading?: boolean;
}

type Action =
  | { type: ActionKind.ADD; payload: Task }
  | { type: ActionKind.EDIT; payload: Task }
  | { type: ActionKind.DELETE; payload: Task }
  | { type: 'SET_EDIT_TASK'; payload: Task | null }
  | { type: 'SET_DELETE_TASK'; payload: Task | null }
  | { type: 'RESET'; payload: TaskState };

interface PublicTaskActions {
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onAdd: (task: Task) => void;
  setEditTask: (task: Task) => void;
  setDeleteTask: (task?: Task) => void;
  clearEditTask: () => void;
  clearDeleteTask: () => void;
}

export type TaskAPI = TaskState & PublicTaskActions;

const enum ActionKind {
  ADD = 'ADD',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  SET_EDIT_TASK = 'SET_EDIT_TASK',
  SET_DELETE_TASK = 'SET_DELETE_TASK',
  RESET = 'RESET',
}

const TaskContext = createContext<TaskAPI | null>(null);

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
    case ActionKind.RESET:
      return action.payload;
    default:
      return state;
  }
}

export function TaskProvider({
  children,
  boardId,
  initialBoardTitle = "",
}: {
  children: React.ReactNode,
  boardId: string,
  initialBoardTitle?: string
}) {
  let [state, dispatch] = useReducer(taskReducer, {
    boardId,
    boardTitle: initialBoardTitle,
    tasks: [],
    editTask: null,
    deleteTask: null,
  });

  const [loaded, setLoaded] = useState(false);

  let actions = useMemo<PublicTaskActions>(() => {
    return {
      onEdit(task) {
        if (task) dispatch({ type: ActionKind.EDIT, payload: task });
      },
      onDelete(task) {
        if (task) dispatch({ type: ActionKind.DELETE, payload: task });
      },
      onAdd(task) {
        if (!task.id) task.id = uuidv4();
        dispatch({ type: ActionKind.ADD, payload: task });

        const taskRef = doc(db, "boards", boardId, "tasks", task.id);
        setDoc(taskRef, task);
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
  }, [boardId]);

  let api = useMemo<TaskAPI>(() => ({ ...state, ...actions }), [state, actions]);

  useEffect(() => {
    const boardRef = doc(db, "boards", boardId);
    const unsubscribe = onSnapshot(boardRef, async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const tasksSnap = await getDocs(collection(db, "boards", boardId, "tasks"));
        const tasks = tasksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        dispatch({
          type: "RESET",
          payload: {
            boardId: snapshot.id,
            boardTitle: data.title || "",
            tasks,
            editTask: null,
            deleteTask: null,
          },
        });
      }
      setLoaded(true);
    });

    return () => unsubscribe();
  }, [boardId]);

  return <TaskContext.Provider value={api}>{children}</TaskContext.Provider>;
}

export function useTask(): TaskAPI {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTask must be used within TaskProvider");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (context.tasks.length || context.boardTitle) setLoading(false);
  }, [context]);

  return { ...context, loading };
}

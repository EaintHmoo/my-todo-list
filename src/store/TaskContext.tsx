"use client";

import { Action, ActionKind, PublicTaskActions, TaskAPI, TaskState } from "@/model/task";
import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { doc,onSnapshot} from "firebase/firestore";
import { db } from "@/libs/firebase";
import LoadingPage from "@/components/LoadingPage";
import { deleteTask, fetchBoardWithTasks, storeTask, updateTask } from "@/libs/task";

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
}: {
  children: React.ReactNode,
  boardId: string,
}) {
  let [state, dispatch] = useReducer(taskReducer, {
    boardId,
    tasks: [],
    editTask: null,
    deleteTask: null,
  });

  const [loaded, setLoaded] = useState(false);

  let actions = useMemo<PublicTaskActions>(() => {
    return {
      async onEdit(task) {
        if (!task?.id) return;
        dispatch({ type: ActionKind.EDIT, payload: task });
        await updateTask(boardId,task);
      },
      async onDelete(task) {
        if (!task?.id) return;
        dispatch({ type: ActionKind.DELETE, payload: task });
        await deleteTask(boardId,task.id);
      },      
      async onAdd(task) {
        if (!task.id) task.id = uuidv4();
        dispatch({ type: ActionKind.ADD, payload: task });
        await storeTask(boardId,task);
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
        const result = await fetchBoardWithTasks(boardId);
  
        if (result) {
          dispatch({
            type: "RESET",
            payload: {
              ...result,
              editTask: null,
              deleteTask: null,
            },
          });
        }
      }
      setLoaded(true);
    });
  
    return () => unsubscribe();
  }, [boardId]);

  return <>
  <TaskContext.Provider value={api}>{children}</TaskContext.Provider>
  { !loaded && <LoadingPage/> }
  </>;
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

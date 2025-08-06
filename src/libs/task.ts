import { ColumnId,Column, Task, TaskState } from "@/model/task";
import { v4 as uuidv4 } from 'uuid';
import { doc, getDocs, setDoc, onSnapshot, collection, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "@/libs/firebase";

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

export const fetchBoardWithTasks = async (boardId:string): Promise<TaskState|null> => {
    const boardRef = doc(db, "boards", boardId);
    const boardSnap = await getDoc(boardRef);

    if (!boardSnap.exists()) {
        return null;
    }

    const data = boardSnap.data();
    const tasksSnap = await getDocs(collection(db, "boards", boardId, "tasks"));
    const tasks = tasksSnap.docs.map((doc) => ({
        ...(doc.data() as Task),
        id: doc.id,
    }));

    return {
        boardId: boardSnap.id,
        boardTitle: data.title || "",
        tasks,
    } as TaskState;
};

/**
 * Store a new task in the specified board.
 */
export const storeTask = async (boardId: string, task: Task): Promise<void> => {
    const taskRef = doc(db, "boards", boardId, "tasks", task.id);
    await setDoc(taskRef, task);
  };
  
  /**
   * Update an existing task (only provided fields will be merged).
   */
  export const updateTask = async (boardId: string, task: Partial<Task> & { id: string }): Promise<void> => {
    const taskRef = doc(db, "boards", boardId, "tasks", task.id);
    await setDoc(taskRef, task, { merge: true });
  };
  
  /**
   * Delete a task from a specific board.
   */
  export const deleteTask = async (boardId: string, taskId: string): Promise<void> => {
    const taskRef = doc(db, "boards", boardId, "tasks", taskId);
    await deleteDoc(taskRef);
  };
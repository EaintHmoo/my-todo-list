import { v4 as uuidv4 } from "uuid";
import {
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  collection,
  getDoc,
} from "firebase/firestore";
import { Board } from "@/model/board";
import { db } from "@/libs/firebase";

export const getBoards = async (): Promise<Board[]> => {
    const snapshot = await getDocs(collection(db, "boards"));
    const boards = snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Board)
    );
    return boards;
};

export const getBoardById = async (boardId: string): Promise<Board | null> => {
    const boardRef = doc(db, "boards", boardId);
    const snapshot = await getDoc(boardRef);

    if (!snapshot.exists()) {
        return null; // Board not found
    }
    return { id: snapshot.id, ...(snapshot.data() as Omit<Board, "id">) };
};

export const storeBoard = async (title: string):Promise<Board> => {
    const boardId = uuidv4();
    const newBoard = { id: boardId, title };
    await setDoc(doc(db, "boards", boardId), { title });
    return newBoard;
};

export const updateBoard = async (boardId: string, newTitle: string):Promise<Board> => {
    const updatedBoard = { id: boardId, title: newTitle };
    await updateDoc(doc(db, "boards", boardId), { title: newTitle });
    return updatedBoard;
 };


export const deleteBoardById = async (boardId: string) => {
      const tasksRef = collection(db, "boards", boardId, "tasks");
      const tasksSnap = await getDocs(tasksRef);

      const deleteTasks = tasksSnap.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deleteTasks);

      await deleteDoc(doc(db, "boards", boardId));
  };
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { doc, getDocs, setDoc, onSnapshot, collection, deleteDoc } from "firebase/firestore";
import { db } from "@/libs/firebase";

interface Board {
    id: string;
    title: string;
}

interface BoardContextType {
    boards: Board[];
    currentBoard: Board | null;
    setCurrentBoard: (board: Board) => void;
    createBoard: (title: string) => Promise<void>;
}

const BoardContext = createContext<BoardContextType | null>(null);

export function BoardProvider({ children }: { children: React.ReactNode }) {
const [boards, setBoards] = useState<Board[]>([]);
const [currentBoard, setCurrentBoard] = useState<Board | null>(null);

useEffect(() => {
    const loadBoards = async () => {
    const snapshot = await getDocs(collection(db, "boards"));
    const result = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Board));
    setBoards(result);
    };
    loadBoards();
}, []);

const createBoard = async (title: string) => {
    const boardId = uuidv4();
    const boardRef = doc(db, "boards", boardId);
    await setDoc(boardRef, { title });
    const newBoard = { id: boardId, title };
    setBoards(prev => [...prev, newBoard]);
    setCurrentBoard(newBoard);
};

return (
    <BoardContext.Provider value={{ boards, currentBoard, setCurrentBoard, createBoard }}>
    {children}
    </BoardContext.Provider>
);
}

export function useBoard() {
    const context = useContext(BoardContext);
    if (!context) throw new Error("useBoard must be used within BoardProvider");
    return context;
}
  
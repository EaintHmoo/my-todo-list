"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
  useState,
} from "react";

import LoadingPage from "../components/LoadingPage";
import { Board, BoardAction, BoardState } from "@/model/board";
import { deleteBoardById, getBoards, storeBoard, updateBoard } from "@/libs/board";



// --------- Reducer ---------
const boardReducer = (state: BoardState, action: BoardAction): BoardState => {
  switch (action.type) {
    case "SET_BOARDS":
      return { ...state, boards: action.payload };
    case "ADD_BOARD":
      return {
        ...state,
        boards: [...state.boards, action.payload],
        currentBoard: action.payload,
      };
    case "EDIT_BOARD":
      return {
        ...state,
        boards: state.boards.map((board) =>
          board.id === action.payload.id ? action.payload : board
        ),
        currentBoard: action.payload,
      };
    case "DELETE_BOARD":
      return {
        ...state,
        boards: state.boards.filter((board) => board.id !== action.payload),
        currentBoard: state.currentBoard?.id === action.payload ? null : state.currentBoard,
      };
    case "SET_CURRENT_BOARD":
      return { ...state, currentBoard: action.payload };
    default:
      return state;
  }
};

// --------- Context ---------
interface BoardContextType {
  boards: Board[];
  currentBoard: Board | null;
  setCurrentBoard: (board: Board | null) => void;
  createBoard: (title: string) => Promise<void>;
  editBoard: (boardId: string, newTitle: string) => Promise<void>;
  deleteBoard: (boardId: string) => Promise<void>;
}

const BoardContext = createContext<BoardContextType | null>(null);

// --------- Provider ---------
export function BoardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(boardReducer, {
    boards: [],
    currentBoard: null,
  });

   const [loaded, setLoaded] = useState(false);

  // Load boards on mount
  useEffect(() => {
    const fetchBoards = async () => {
      const boards = await getBoards();
      dispatch({ type: "SET_BOARDS", payload: boards });
      setLoaded(true);
    };

    fetchBoards();
  }, []);

  // Create board
  const createBoard = async (title: string) => {
    const newBoard = await storeBoard(title);
    dispatch({ type: "ADD_BOARD", payload: newBoard });
  };

  // Edit board
  const editBoard = async (boardId: string, newTitle: string) => {
    const updatedBoard = await updateBoard(boardId, newTitle);
    dispatch({ type: "EDIT_BOARD", payload: updatedBoard });
  };

  // Delete board and its tasks
  const deleteBoard = async (boardId: string) => {
    try {
      await deleteBoardById(boardId);
      dispatch({ type: "DELETE_BOARD", payload: boardId });
    } catch (err) {
      console.error("Error deleting board:", err);
    }
  };

  const setCurrentBoard = (board: Board | null) => {
    dispatch({ type: "SET_CURRENT_BOARD", payload: board });
  };

  return (
    <>
      <BoardContext.Provider
      value={{
        boards: state.boards,
        currentBoard: state.currentBoard,
        setCurrentBoard,
        createBoard,
        editBoard,
        deleteBoard,
      }}
    >
      {children}
    </BoardContext.Provider>
    {!loaded && <LoadingPage/> }
    </>
  );
}

// --------- Hook ---------
export function useBoard() {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("useBoard must be used within a BoardProvider");
  }
  return context;
}

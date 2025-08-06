// --------- Types ---------
export interface Board {
    id: string;
    title: string;
  }
  
export interface BoardState {
boards: Board[];
currentBoard: Board | null;
}

export type BoardAction =
| { type: "SET_BOARDS"; payload: Board[] }
| { type: "ADD_BOARD"; payload: Board }
| { type: "EDIT_BOARD"; payload: Board }
| { type: "DELETE_BOARD"; payload: string }
| { type: "SET_CURRENT_BOARD"; payload: Board | null };
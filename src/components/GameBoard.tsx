import type { Cell } from "../game/types";
import closedImg from "../assets/game/closed.svg";
import flagImg from "../assets/game/flag.svg";
import mineImg from "../assets/game/mine.svg";
import mineRedImg from "../assets/game/mine_red.svg";
import mineWrongImg from "../assets/game/mine_wrong.svg";
import type0Img from "../assets/game/type0.svg";
import type1Img from "../assets/game/type1.svg";
import type2Img from "../assets/game/type2.svg";
import type3Img from "../assets/game/type3.svg";
import type4Img from "../assets/game/type4.svg";
import type5Img from "../assets/game/type5.svg";
import type6Img from "../assets/game/type6.svg";
import type7Img from "../assets/game/type7.svg";
import type8Img from "../assets/game/type8.svg";

const typeImages = [
  type0Img,
  type1Img,
  type2Img,
  type3Img,
  type4Img,
  type5Img,
  type6Img,
  type7Img,
  type8Img,
];

interface GameBoardProps {
  board: Cell[][] | null;
  rows: number;
  cols: number;
  gameOver: boolean;
  onCellClick: (r: number, c: number) => void;
  onCellRightClick: (e: React.MouseEvent, r: number, c: number) => void;
}

const getCellImage = (
  cell: Cell,
  r: number,
  c: number,
  board: Cell[][] | null,
  gameOver: boolean,
  rows: number
) => {
  if (cell.state === "flagged") {
    if (gameOver && !cell.isMine) {
      return mineWrongImg;
    }
    return flagImg;
  }
  if (cell.state === "closed") return closedImg;
  if (cell.isMine) {
    if (gameOver && board) {
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (
            board[i][j].state === "opened" &&
            board[i][j].isMine &&
            i === r &&
            j === c
          ) {
            return mineRedImg;
          }
        }
      }
    }
    return mineImg;
  }
  return typeImages[cell.adjacentMines];
};

export function GameBoard({
  board,
  rows,
  cols,
  gameOver,
  onCellClick,
  onCellRightClick,
}: GameBoardProps) {
  if (!board) {
    return (
      <div
        className="board initial-board"
        style={{
          gridTemplateColumns: `repeat(${cols}, 32px)`,
          gridTemplateRows: `repeat(${rows}, 32px)`,
        }}
      >
        {Array(rows)
          .fill(null)
          .map((_, r) =>
            Array(cols)
              .fill(null)
              .map((_, c) => (
                <div
                  key={`${r}-${c}`}
                  className="cell initial-cell"
                  onClick={() => onCellClick(r, c)}
                >
                  <img src={closedImg} alt="cell" />
                </div>
              ))
          )}
      </div>
    );
  }

  return (
    <div
      className="board"
      style={{
        gridTemplateColumns: `repeat(${cols}, 32px)`,
        gridTemplateRows: `repeat(${rows}, 32px)`,
      }}
    >
      {board.map((row, r) =>
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            className="cell"
            onClick={() => onCellClick(r, c)}
            onContextMenu={(e) => onCellRightClick(e, r, c)}
          >
            <img src={getCellImage(cell, r, c, board, gameOver, rows)} alt="cell" />
          </div>
        ))
      )}
    </div>
  );
}

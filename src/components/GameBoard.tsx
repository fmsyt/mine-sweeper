/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
import { useRef } from "react";
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
import { useGame } from "../contexts/GameContext";
import type { Cell } from "../game/types";

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

const getCellImage = (
  cell: Cell,
  r: number,
  c: number,
  board: Cell[][] | null,
  gameOver: boolean,
  rows: number,
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

export function GameBoard() {
  const {
    board,
    rows,
    cols,
    gameOver,
    holdToFlagDurationMs,
    animatingFlags,
    handleCellClick,
    handleCellRightClick,
  } = useGame();
  const mouseDownTime = useRef<number | null>(null);
  const mouseDownCell = useRef<{ r: number; c: number } | null>(null);
  const longPressTimer = useRef<number | null>(null);
  const longPressTriggered = useRef<boolean>(false);

  const handleMouseDown = (r: number, c: number) => {
    mouseDownTime.current = Date.now();
    mouseDownCell.current = { r, c };
    longPressTriggered.current = false;

    longPressTimer.current = window.setTimeout(() => {
      longPressTriggered.current = true;
      const syntheticEvent = {
        preventDefault: () => {},
      } as React.MouseEvent;
      handleCellRightClick(syntheticEvent, r, c);
    }, holdToFlagDurationMs);
  };

  const handleMouseUp = (r: number, c: number) => {
    if (longPressTimer.current !== null) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (
      !longPressTriggered.current &&
      mouseDownTime.current !== null &&
      mouseDownCell.current?.r === r &&
      mouseDownCell.current?.c === c
    ) {
      handleCellClick(r, c);
    }

    mouseDownTime.current = null;
    mouseDownCell.current = null;
    longPressTriggered.current = false;
  };

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
                <button
                  type="button"
                  key={`${r}-${c}`}
                  className="cell initial-cell"
                  onMouseDown={() => handleMouseDown(r, c)}
                  onMouseUp={() => handleMouseUp(r, c)}
                >
                  <img src={closedImg} alt="cell" />
                </button>
              )),
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
        row.map((cell, c) => {
          const cellKey = `${r}-${c}`;
          const isAnimating = animatingFlags.has(cellKey);
          return (
            <button
              type="button"
              key={cellKey}
              className="cell"
              onPointerDown={() => handleMouseDown(r, c)}
              onPointerUp={() => handleMouseUp(r, c)}
              onContextMenu={(e) => handleCellRightClick(e, r, c)}
            >
              <img
                src={getCellImage(cell, r, c, board, gameOver, rows)}
                alt="cell"
                className={
                  isAnimating && cell.state === "flagged" ? "flag-drop" : ""
                }
              />
            </button>
          );
        }),
      )}
    </div>
  );
}

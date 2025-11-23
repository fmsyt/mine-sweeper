import { useState } from "react";
import "./App.css";
import closedImg from "./assets/game/closed.svg";
import flagImg from "./assets/game/flag.svg";
import mineImg from "./assets/game/mine.svg";
import mineRedImg from "./assets/game/mine_red.svg";
import type0Img from "./assets/game/type0.svg";
import type1Img from "./assets/game/type1.svg";
import type2Img from "./assets/game/type2.svg";
import type3Img from "./assets/game/type3.svg";
import type4Img from "./assets/game/type4.svg";
import type5Img from "./assets/game/type5.svg";
import type6Img from "./assets/game/type6.svg";
import type7Img from "./assets/game/type7.svg";
import type8Img from "./assets/game/type8.svg";

type CellState = "closed" | "opened" | "flagged";
type Cell = {
  isMine: boolean;
  state: CellState;
  adjacentMines: number;
};

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

function App() {
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [mineCount, setMineCount] = useState(10);
  const [board, setBoard] = useState<Cell[][] | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [firstClick, setFirstClick] = useState(true);

  const initializeBoard = (clickedRow: number, clickedCol: number) => {
    const newBoard: Cell[][] = Array(rows)
      .fill(null)
      .map(() =>
        Array(cols)
          .fill(null)
          .map(() => ({
            isMine: false,
            state: "closed" as CellState,
            adjacentMines: 0,
          }))
      );

    const mines = new Set<string>();
    while (mines.size < mineCount) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      const key = `${r},${c}`;
      if (r === clickedRow && c === clickedCol) continue;
      if (
        Math.abs(r - clickedRow) <= 1 &&
        Math.abs(c - clickedCol) <= 1
      )
        continue;
      mines.add(key);
    }

    mines.forEach((key) => {
      const [r, c] = key.split(",").map(Number);
      newBoard[r][c].isMine = true;
    });

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!newBoard[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              const nr = r + dr;
              const nc = c + dc;
              if (
                nr >= 0 &&
                nr < rows &&
                nc >= 0 &&
                nc < cols &&
                newBoard[nr][nc].isMine
              ) {
                count++;
              }
            }
          }
          newBoard[r][c].adjacentMines = count;
        }
      }
    }

    return newBoard;
  };

  const openCell = (r: number, c: number, newBoard: Cell[][]) => {
    if (
      r < 0 ||
      r >= rows ||
      c < 0 ||
      c >= cols ||
      newBoard[r][c].state !== "closed"
    )
      return;

    newBoard[r][c].state = "opened";

    if (newBoard[r][c].adjacentMines === 0 && !newBoard[r][c].isMine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          openCell(r + dr, c + dc, newBoard);
        }
      }
    }
  };

  const handleCellClick = (r: number, c: number) => {
    if (gameOver || gameWon) return;

    if (firstClick) {
      const newBoard = initializeBoard(r, c);
      openCell(r, c, newBoard);
      setBoard(newBoard);
      setFirstClick(false);
      checkWin(newBoard);
      return;
    }

    if (!board) return;

    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));

    if (newBoard[r][c].state === "flagged") return;

    if (newBoard[r][c].state === "opened") {
      const adjacentMines = newBoard[r][c].adjacentMines;
      let flaggedCount = 0;

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (
            nr >= 0 &&
            nr < rows &&
            nc >= 0 &&
            nc < cols &&
            newBoard[nr][nc].state === "flagged"
          ) {
            flaggedCount++;
          }
        }
      }

      if (flaggedCount === adjacentMines) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (
              nr >= 0 &&
              nr < rows &&
              nc >= 0 &&
              nc < cols &&
              newBoard[nr][nc].state === "closed"
            ) {
              if (newBoard[nr][nc].isMine) {
                setGameOver(true);
                revealAllMines(newBoard);
                setBoard(newBoard);
                return;
              }
              openCell(nr, nc, newBoard);
            }
          }
        }
      }
    } else if (newBoard[r][c].state === "closed") {
      if (newBoard[r][c].isMine) {
        setGameOver(true);
        newBoard[r][c].state = "opened";
        revealAllMines(newBoard);
      } else {
        openCell(r, c, newBoard);
      }
    }

    setBoard(newBoard);
    checkWin(newBoard);
  };

  const handleCellRightClick = (
    e: React.MouseEvent,
    r: number,
    c: number
  ) => {
    e.preventDefault();
    if (gameOver || gameWon || !board || firstClick) return;

    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));

    if (newBoard[r][c].state === "closed") {
      newBoard[r][c].state = "flagged";
    } else if (newBoard[r][c].state === "flagged") {
      newBoard[r][c].state = "closed";
    }

    setBoard(newBoard);
  };

  const revealAllMines = (newBoard: Cell[][]) => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (newBoard[r][c].isMine) {
          newBoard[r][c].state = "opened";
        }
      }
    }
  };

  const checkWin = (newBoard: Cell[][]) => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!newBoard[r][c].isMine && newBoard[r][c].state !== "opened") {
          return;
        }
      }
    }
    setGameWon(true);
  };

  const resetGame = () => {
    setBoard(null);
    setGameOver(false);
    setGameWon(false);
    setFirstClick(true);
  };

  const getCellImage = (cell: Cell, r: number, c: number) => {
    if (cell.state === "flagged") return flagImg;
    if (cell.state === "closed") return closedImg;
    if (cell.isMine) {
      if (gameOver && board) {
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
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

  return (
    <main className="container">
      <h1>Minesweeper</h1>

      {!board && (
        <>
          <div className="settings">
            <div>
              <label>
                Rows:
                <input
                  type="number"
                  value={rows}
                  onChange={(e) => setRows(Math.max(5, Number(e.target.value)))}
                  min="5"
                  max="30"
                />
              </label>
            </div>
            <div>
              <label>
                Columns:
                <input
                  type="number"
                  value={cols}
                  onChange={(e) => setCols(Math.max(5, Number(e.target.value)))}
                  min="5"
                  max="30"
                />
              </label>
            </div>
            <div>
              <label>
                Mines:
                <input
                  type="number"
                  value={mineCount}
                  onChange={(e) =>
                    setMineCount(
                      Math.min(
                        Math.max(1, Number(e.target.value)),
                        rows * cols - 9
                      )
                    )
                  }
                  min="1"
                  max={rows * cols - 9}
                />
              </label>
            </div>
            <p className="instruction">👇 Click any cell below to start the game!</p>
          </div>

          <div className="game-area">
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
                        onClick={() => handleCellClick(r, c)}
                      >
                        <img src={closedImg} alt="cell" />
                      </div>
                    ))
                )}
            </div>
          </div>
        </>
      )}

      {board && (
        <div className="game-area">
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
                  onClick={() => handleCellClick(r, c)}
                  onContextMenu={(e) => handleCellRightClick(e, r, c)}
                >
                  <img src={getCellImage(cell, r, c)} alt="cell" />
                </div>
              ))
            )}
          </div>

          {gameOver && <div className="status">Game Over! 💥</div>}
          {gameWon && <div className="status">You Win! 🎉</div>}

          <button onClick={resetGame} className="reset-btn">
            New Game
          </button>
        </div>
      )}
    </main>
  );
}

export default App;

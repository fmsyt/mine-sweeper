import { useState } from "react";
import "./App.css";
import { DifficultySettings } from "./components/DifficultySettings";
import { GameBoard } from "./components/GameBoard";
import { DIFFICULTY_PRESETS } from "./game/constants";
import {
  checkWin,
  initializeBoard,
  openCell,
  revealAllMines,
} from "./game/gameLogic";
import type { Cell, Difficulty } from "./game/types";

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [rows, setRows] = useState(9);
  const [cols, setCols] = useState(9);
  const [mineCount, setMineCount] = useState(10);
  const [board, setBoard] = useState<Cell[][] | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [firstClick, setFirstClick] = useState(true);

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    if (newDifficulty !== "custom") {
      const preset = DIFFICULTY_PRESETS[newDifficulty];
      setRows(preset.rows);
      setCols(preset.cols);
      setMineCount(preset.mines);
    }
  };

  const handleCustomChange = (
    type: "rows" | "cols" | "mines",
    value: number,
  ) => {
    setDifficulty("custom");
    if (type === "rows") setRows(Math.max(5, value));
    else if (type === "cols") setCols(Math.max(5, value));
    else setMineCount(Math.min(Math.max(1, value), rows * cols - 9));
  };

  const handleCellClick = (r: number, c: number) => {
    if (gameOver || gameWon) return;

    if (firstClick) {
      const newBoard = initializeBoard(rows, cols, mineCount, r, c);
      openCell(r, c, newBoard, rows, cols);
      setBoard(newBoard);
      setFirstClick(false);
      if (checkWin(newBoard, rows, cols)) {
        setGameWon(true);
      }
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
                revealAllMines(newBoard, rows, cols);
                setBoard(newBoard);
                return;
              }
              openCell(nr, nc, newBoard, rows, cols);
            }
          }
        }
      }
    } else if (newBoard[r][c].state === "closed") {
      if (newBoard[r][c].isMine) {
        setGameOver(true);
        newBoard[r][c].state = "opened";
        revealAllMines(newBoard, rows, cols);
      } else {
        openCell(r, c, newBoard, rows, cols);
      }
    }

    setBoard(newBoard);
    if (checkWin(newBoard, rows, cols)) {
      setGameWon(true);
    }
  };

  const handleCellRightClick = (e: React.MouseEvent, r: number, c: number) => {
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

  const resetGame = () => {
    setBoard(null);
    setGameOver(false);
    setGameWon(false);
    setFirstClick(true);
  };

  return (
    <main className="container">
      <h1>Minesweeper</h1>

      {!board && (
        <>
          <DifficultySettings
            difficulty={difficulty}
            rows={rows}
            cols={cols}
            mineCount={mineCount}
            onDifficultyChange={handleDifficultyChange}
            onCustomChange={handleCustomChange}
          />

          <div className="game-area">
            <GameBoard
              board={null}
              rows={rows}
              cols={cols}
              gameOver={false}
              onCellClick={handleCellClick}
              onCellRightClick={handleCellRightClick}
            />
          </div>
        </>
      )}

      {board && (
        <div className="game-area">
          <GameBoard
            board={board}
            rows={rows}
            cols={cols}
            gameOver={gameOver}
            onCellClick={handleCellClick}
            onCellRightClick={handleCellRightClick}
          />

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

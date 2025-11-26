import "./App.css";
import { DifficultySettings } from "./components/DifficultySettings";
import { GameBoard } from "./components/GameBoard";
import { GameStatus } from "./components/GameStatus";
import { useGame } from "./contexts/GameContext";

function App() {
  const { board, gameOver, gameWon, resetGame } = useGame();

  return (
    <main className="container">
      <h1>Minesweeper</h1>

      {!board && (
        <>
          <DifficultySettings />

          <div className="game-area">
            <GameBoard />
          </div>
        </>
      )}

      {board && (
        <div className="game-area">
          <GameStatus />

          <GameBoard />

          {gameOver && <div className="status">Game Over! 💥</div>}
          {gameWon && <div className="status">You Win! 🎉</div>}

          <button type="button" onClick={resetGame} className="reset-btn">
            New Game
          </button>
        </div>
      )}
    </main>
  );
}

export default App;

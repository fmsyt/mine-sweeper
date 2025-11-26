import { useGame } from "../contexts/GameContext";

export function DifficultySettings() {
  const {
    difficulty,
    rows,
    cols,
    mineCount,
    showFlagAnimation,
    handleDifficultyChange,
    handleCustomChange,
    toggleFlagAnimation,
  } = useGame();
  return (
    <div className="settings">
      <div className="difficulty-buttons">
        <button
          type="button"
          className={difficulty === "beginner" ? "active" : ""}
          onClick={() => handleDifficultyChange("beginner")}
        >
          初級 (9×9, 10)
        </button>
        <button
          type="button"
          className={difficulty === "intermediate" ? "active" : ""}
          onClick={() => handleDifficultyChange("intermediate")}
        >
          中級 (16×16, 40)
        </button>
        <button
          type="button"
          className={difficulty === "expert" ? "active" : ""}
          onClick={() => handleDifficultyChange("expert")}
        >
          上級 (16×30, 99)
        </button>
        <button
          type="button"
          className={difficulty === "custom" ? "active" : ""}
          onClick={() => handleDifficultyChange("custom")}
        >
          カスタム
        </button>
      </div>

      {difficulty === "custom" && (
        <div className="custom-settings">
          <div>
            <label>
              Rows:
              <input
                type="number"
                value={rows}
                onChange={(e) =>
                  handleCustomChange("rows", Number(e.target.value))
                }
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
                onChange={(e) =>
                  handleCustomChange("cols", Number(e.target.value))
                }
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
                  handleCustomChange("mines", Number(e.target.value))
                }
                min="1"
                max={rows * cols - 9}
              />
            </label>
          </div>
        </div>
      )}

      <div className="animation-toggle">
        <label>
          <input
            type="checkbox"
            checked={showFlagAnimation}
            onChange={toggleFlagAnimation}
          />
          フラグアニメーション
        </label>
      </div>

      <p className="instruction">👇 Click any cell below to start the game!</p>
    </div>
  );
}

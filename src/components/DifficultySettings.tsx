import type { Difficulty } from "../game/types";

interface DifficultySettingsProps {
  difficulty: Difficulty;
  rows: number;
  cols: number;
  mineCount: number;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onCustomChange: (type: "rows" | "cols" | "mines", value: number) => void;
}

export function DifficultySettings({
  difficulty,
  rows,
  cols,
  mineCount,
  onDifficultyChange,
  onCustomChange,
}: DifficultySettingsProps) {
  return (
    <div className="settings">
      <div className="difficulty-buttons">
        <button
          className={difficulty === "beginner" ? "active" : ""}
          onClick={() => onDifficultyChange("beginner")}
        >
          初級 (9×9, 10)
        </button>
        <button
          className={difficulty === "intermediate" ? "active" : ""}
          onClick={() => onDifficultyChange("intermediate")}
        >
          中級 (16×16, 40)
        </button>
        <button
          className={difficulty === "expert" ? "active" : ""}
          onClick={() => onDifficultyChange("expert")}
        >
          上級 (16×30, 99)
        </button>
        <button
          className={difficulty === "custom" ? "active" : ""}
          onClick={() => onDifficultyChange("custom")}
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
                onChange={(e) => onCustomChange("rows", Number(e.target.value))}
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
                onChange={(e) => onCustomChange("cols", Number(e.target.value))}
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
                  onCustomChange("mines", Number(e.target.value))
                }
                min="1"
                max={rows * cols - 9}
              />
            </label>
          </div>
        </div>
      )}

      <p className="instruction">👇 Click any cell below to start the game!</p>
    </div>
  );
}

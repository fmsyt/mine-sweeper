import { DigitDisplay } from "./DigitDisplay";

interface GameStatusProps {
  minesRemaining: number;
  elapsedTime: number;
}

export function GameStatus({ minesRemaining, elapsedTime }: GameStatusProps) {
  return (
    <div className="game-status">
      <DigitDisplay value={minesRemaining} />
      <DigitDisplay value={elapsedTime} />
    </div>
  );
}

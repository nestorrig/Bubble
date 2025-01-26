import { atom, useAtom } from "jotai";

export const gameStateUI = atom({
  score: 0,
  life: 100,
  isGameOver: false,
  shootsAvailable: 12,
  isGameStarted: false,
  isGamePaused: false,
});

export const UI = () => {
  const [gameState, setGameState] = useAtom(gameStateUI);

  return (
    <div className="fixed top-10 left-0 min-w-2xs ">
      <div className="absolute top-0 left-0 p-4 bg-black bg-opacity-50 text-white">
        <div>Score: {gameState.score}</div>
        <div>Life: {gameState.life.toFixed(2)}</div>
        <div>Kills: {gameState.kills}</div>
        <div>Shoots: {gameState.shootsAvailable}</div>
        <div>Game Over: {gameState.isGameOver ? "true" : "false"}</div>
        <div>Game Started: {gameState.isGameStarted ? "true" : "false"}</div>
        <button
          onClick={() =>
            setGameState((prev) => ({
              ...prev,
              isGamePaused: !prev.isGamePaused,
            }))
          }
        >
          Game Paused: {gameState.isGamePaused ? "true" : "false"}
        </button>
      </div>
    </div>
  );
};

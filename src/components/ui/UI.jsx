import gsap from "gsap";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { GiLifeBar } from "react-icons/gi";
import { RiBubbleChartLine, RiMedalLine } from "react-icons/ri";
import { playAudio } from "./Audio";
import { CiPlay1 } from "react-icons/ci";
import {
  IoPauseCircleOutline,
  IoPlayOutline,
  IoPlaySkipBackOutline,
  IoPlaySkipForwardOutline,
} from "react-icons/io5";

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
  const [audioState, setAudioState] = useAtom(playAudio);

  useEffect(() => {
    if (gameState.shootsAvailable <= 0) {
      gsap.to(".ShootsBar", {
        duration: 2,
        width: "100%",
        ease: "power2.inOut",
      });
    }
  }, [gameState.shootsAvailable]);

  useEffect(() => {
    gsap.set(".LifeBar", { backgroundColor: "white" });
    gsap.to(".LifeBar", {
      backgroundColor: "red",
      duration: 0.05,
      repeat: 1,
      yoyo: true,
    });
  }, [gameState.life]);

  useEffect(() => {
    gsap.set(".Score", { scale: 1 });
    gsap.to(".Score", {
      duration: 0.04,
      scale: 2,
      repeat: 1,
      yoyo: true,
    });
  }, [gameState.score]);

  return (
    <div className="fixed top-10 left-0">
      <div className="fixed flex gap-10 lg:top-4 top-20 scale-90 lg:scale-100 left-1/2 -translate-x-1/2 p-4  text-white font-bold pointer-events-none">
        <div className="lg:w-24 w-20mb-2 flex gap-6 items-center justify-start select-none">
          <RiMedalLine size={32} />{" "}
          <span className="Score">{gameState.score}</span>
        </div>
        <div className="relative lg:w-24 w-20mb-2 flex gap-6 items-center justify-start select-none">
          <GiLifeBar size={32} /> {gameState.life.toFixed(2)}
          <div
            className="LifeBar absolute -bottom-2 h-0.5 scale-110 rounded"
            style={{
              width: `${(gameState.life / 100) * 100}%`,
              background: "white",
            }}
          ></div>
        </div>
        <div className="relative lg:w-24 w-20mb-2 flex gap-6 items-center justify-start select-none transition-all">
          <RiBubbleChartLine size={32} /> {gameState.shootsAvailable}
          <div
            className="ShootsBar absolute -bottom-2 h-0.5 scale-110 rounded"
            style={{
              width: `${(gameState.shootsAvailable / 12) * 100}%`,
              background: "white",
            }}
          ></div>
        </div>
      </div>
      {gameState.isGamePaused && (
        <div className=" fixed mt-4 p-4 bg-gray-800 bg-opacity-75 rounded top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <h2 className="text-xl font-bold mb-2">Game Paused</h2>
          <button
            className="mb-2 px-4 py-2 bg-green-500 hover:bg-green-700 text-white font-bold rounded"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setGameState((prev) => ({
                ...prev,
                isGamePaused: false,
              }));
            }}
          ></button>

          <div className="mt-2 p-2 bg-gray-700 rounded">
            <h3 className="text-lg font-bold">Credits</h3>
            <article>
              <h1>Game developed by: Nestor Rios Garcia</h1>
              <div>
                <a href="https://www.linkedin.com/in/nestorrig/">Linkedin</a>
                <a href="https://github.com/nestorrig">Github</a>
                <a href="https://x.com/nestorrig">Twitter</a>
              </div>
            </article>
            <article>
              <h2>Models</h2>
              <ul>
                <li>
                  Robot Enemy Legs Gun by Quaternius
                  (https://poly.pizza/m/lFZfDh2hzP)
                </li>
                <li>
                  Gun ver2 by Zhuoqun Robin Xu [CC-BY]
                  (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza
                  (https://poly.pizza/m/7OfsrgiJ-uN)
                </li>
              </ul>
            </article>

            <article>
              <h2>music</h2>
              <ul>
                <li>
                  Music by{" "}
                  <a href="https://pixabay.com/es/users/ginodada-42266153/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=235488">
                    GINODADA
                  </a>{" "}
                  from{" "}
                  <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=235488">
                    Pixabay
                  </a>
                </li>
              </ul>
            </article>

            <article>
              <h2>Sound Effects</h2>
              <ul>
                <li>
                  Sound Effect by{" "}
                  <a href="https://pixabay.com/es/users/floraphonic-38928062/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=169075">
                    floraphonic
                  </a>{" "}
                  from{" "}
                  <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=169075">
                    Pixabay
                  </a>
                </li>
                <li>
                  Sound Effect by{" "}
                  <a href="https://pixabay.com/es/users/u_iozlfd2w96-48029382/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=283674">
                    u_iozlfd2w96
                  </a>{" "}
                  from{" "}
                  <a href="https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=283674">
                    Pixabay
                  </a>
                </li>
              </ul>
            </article>
          </div>
        </div>
      )}
      <button
        className="fixed top-4 right-4 mb-2 px-4 py-2 border border-white text-white font-bold rounded"
        onClick={() =>
          setGameState((prev) => ({
            ...prev,
            isGamePaused: !prev.isGamePaused,
          }))
        }
      >
        {gameState.isGamePaused ? <FaPlay /> : <FaPause />}
      </button>

      {/* <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
        <button
          onClick={() => {
            setAudioState((prev) => ({
              ...prev,
              song: (prev.song - 1 + 3) % 3,
            }));
          }}
        >
          <IoPlaySkipBackOutline size={32} />
        </button>
        <button
          onClick={() => {
            setAudioState((prev) => ({
              ...prev,
              ambientSong: !prev.ambientSong,
            }));
          }}
        >
          {!audioState.ambientSong ? (
            <IoPlayOutline size={32} />
          ) : (
            <IoPauseCircleOutline size={32} />
          )}
        </button>
        <button
          onClick={() => {
            setAudioState((prev) => ({
              ...prev,
              song: (prev.song + 1) % 3,
            }));
          }}
        >
          <IoPlaySkipForwardOutline size={32} />
        </button>
      </div> */}
    </div>
  );
};

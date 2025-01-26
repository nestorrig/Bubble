import { Loader, OrbitControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Effects, Floor, Lights } from "./enviroment";
import { ControlPlayer } from "./player";
import { Physics } from "@react-three/rapier";
import { MathUtils } from "three";
import { Enemy } from "./enemies/Enemy";
import { useControls } from "leva";
import { gameStateUI } from "../ui/UI";
import { useAtom } from "jotai";
import { Suspense } from "react";
import { isMobile } from "react-device-detect";

const enemies = Array.from({ length: 8 }, () => ({}));

export const Experience = () => {
  const { rendering } = useControls({
    rendering: {
      value: "always",
      options: ["always", "demand", "never"],
    },
  });
  const [gameState] = useAtom(gameStateUI);
  return (
    <>
      <Canvas shadows frameloop={gameState.isGamePaused ? "demand" : "always"}>
        <color attach="background" args={["#1111ff"]} />
        <fog attach="fog" args={["#1111ff", -5, 15]} />
        <Effects />

        <Physics>
          <Suspense fallback={null}>
            {enemies.map((enemy, index) => (
              <Enemy key={index} name={"enemy" + index} />
            ))}
            <ControlPlayer />
          </Suspense>
          <Floor />
        </Physics>
        <Lights />
        <Stats />
      </Canvas>
      <Loader className="z-50" />
    </>
  );
};

import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Floor, Lights } from "./enviroment";
import { ControlPlayer } from "./player";
import { Physics } from "@react-three/rapier";
import { MathUtils } from "three";
import { Enemy } from "./enemies/Enemy";

const enemies = Array.from({ length: 7 }, () => ({}));

export const Experience = () => {
  return (
    <Canvas shadows>
      <color attach="background" args={["#1111ff"]} />
      <fog attach="fog" args={["#1111ff", -5, 15]} />
      <Physics>
        {enemies.map((enemy, index) => (
          <Enemy key={index} name={"enemy" + index} />
        ))}
        <ControlPlayer />
        <Floor />
      </Physics>
      {/* <OrbitControls /> */}
      <Lights />
      <Stats />
    </Canvas>
  );
};
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Floor, Lights } from "./enviroment";
import { ControlPlayer, GunModel } from "./player";

export const Experience = () => {
  return (
    <Canvas shadows>
      <ControlPlayer />
      <OrbitControls />
      <Lights />
      <Floor />
      <GunModel />
    </Canvas>
  );
};

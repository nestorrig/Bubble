import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Floor, Lights } from "./enviroment";
import { ControlPlayer } from "./player";
import { Enemy } from "./enemies";

export const Experience = () => {
  return (
    <Canvas shadows>
      <Enemy position={[0, -1, 0]} />
      {/* <ControlPlayer /> */}
      <OrbitControls />
      <Lights />
      <Floor />
    </Canvas>
  );
};

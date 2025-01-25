import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Floor, Lights } from "./enviroment";
import { Bubble, ControlPlayer } from "./player";
import { Enemy } from "./enemies";

export const Experience = () => {
  return (
    <Canvas shadows>
      <color attach="background" args={["#000"]} />
      <Enemy position={[0, -0.5, 0]} />
      <Bubble />
      {/* <ControlPlayer /> */}
      <OrbitControls />
      <Lights />
      <Floor />
    </Canvas>
  );
};

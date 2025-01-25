import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Floor, Lights } from "./enviroment";
import { ControlPlayer } from "./player";
import { Enemy } from "./enemies";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";

export const Experience = () => {
  return (
    <Canvas shadows>
      <color attach="background" args={["#000"]} />
      <Physics debug>
        {/* <RigidBody type="dynamic" colliders={false} position={[0, 1, 0]}>
          <Box />
          <CuboidCollider args={[0.7, 0.35, 0.4]} />
        </RigidBody> */}

        <RigidBody type="fixed" colliders={false} position={[0, -0.65, 0]}>
          <Enemy position={[0, -0.35, 0]} />
          <CuboidCollider
            args={[0.7, 0.35, 0.4]}
            sensor
            onIntersectionEnter={(e) => console.log(e.rigidBodyObject)}
          />
        </RigidBody>
        {/* <Bubble position={[0, 0, 0]} /> */}
        <ControlPlayer />
        <RigidBody type="fixed" position={[0, 0, 0]}>
          <Floor />
        </RigidBody>
      </Physics>
      {/* <OrbitControls /> */}
      <Lights />
      <Stats />
    </Canvas>
  );
};

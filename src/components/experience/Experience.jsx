import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Floor, Lights } from "./enviroment";
import { ControlPlayer } from "./player";
import { Enemy } from "./enemies";
import * as THREE from "three";
import { atom, useAtom } from "jotai";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";

export const newShootTarget = atom(new THREE.Vector3());

export const Experience = () => {
  const [shootTarget, setShootTarget] = useAtom(newShootTarget);

  const handleCanvasClick = (event) => {
    const { clientX, clientY } = event;
    const targetPosition = [
      (clientX / window.innerWidth) * 2 - 1,
      -((clientY / window.innerHeight) * 2 - 1),
      0,
    ];

    setShootTarget(new THREE.Vector3(...targetPosition));

    // Call the shoot function from ControlPlayer
    // You might need to use a ref or context to access the shoot function
  };

  return (
    <Canvas shadows onClick={handleCanvasClick}>
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
      <OrbitControls />
      <Lights />
      <Stats />
    </Canvas>
  );
};

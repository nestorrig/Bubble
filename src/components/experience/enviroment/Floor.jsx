import { RigidBody } from "@react-three/rapier";

export const Floor = () => {
  return (
    <RigidBody type="fixed" position={[0, 0, 0]}>
      <group>
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -1, 0]}
          receiveShadow
        >
          <planeGeometry args={[40, 40]} />
          <meshStandardMaterial color="lightblue" />
        </mesh>
      </group>
    </RigidBody>
  );
};

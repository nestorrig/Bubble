import { useFrame } from "@react-three/fiber";
import { atom, useAtom } from "jotai";
import { useRef } from "react";
import * as THREE from "three";

export const lookAtPanel = atom(new THREE.Vector3());
export const newShootTarget = atom(new THREE.Vector3());

export const ShootPanel = ({ aspect, lookAtPosition }) => {
  const planeRef = useRef();
  const [lookAtPanelPosition, setLookAtPanelPosition] = useAtom(lookAtPanel);
  const [shootTarget, setShootTarget] = useAtom(newShootTarget);

  // const targetOrientation = useRef

  const handlePointerMove = (e) => {
    setLookAtPanelPosition(e.point);
  };

  const handleClick = (event) => {
    setShootTarget(event.point);
  };

  useFrame(() => {
    planeRef.current.lookAt(lookAtPosition);
  });

  return (
    <mesh
      position={[0, 0, -12]}
      ref={planeRef}
      scale={[0.016 * aspect[0], 0.016 * aspect[1], 1]}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
      visible={false}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="red" opacity={0.3} transparent />
    </mesh>
  );
};

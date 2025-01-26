import { useFrame } from "@react-three/fiber";
import { atom, useAtom } from "jotai";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gameStateUI } from "../../ui/UI";
import { isMobile } from "react-device-detect";

export const lookAtPanel = atom(new THREE.Vector3());
export const newShootTarget = atom(new THREE.Vector3());

export const ShootPanel = ({ aspect, lookAtPosition }) => {
  const planeRef = useRef();
  const [lookAtPanelPosition, setLookAtPanelPosition] = useAtom(lookAtPanel);
  const [shootTarget, setShootTarget] = useAtom(newShootTarget);
  const timeoutRef = useRef();

  // const targetOrientation = useRef

  const [gameState, setGameState] = useAtom(gameStateUI);

  const handlePointerMove = (e) => {
    setLookAtPanelPosition(e.point);
  };

  const handleClick = (event) => {
    if (gameState.shootsAvailable <= 0) return;

    setShootTarget(event.point);
    setGameState((prev) => ({
      ...prev,
      shootsAvailable: prev.shootsAvailable - 1,
    }));
  };

  useEffect(() => {
    if (gameState.shootsAvailable <= 0) {
      timeoutRef.current = setTimeout(() => {
        setGameState((prev) => ({
          ...prev,
          shootsAvailable: 12,
        }));
      }, 2000);
    }

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [gameState.shootsAvailable]);

  useFrame(() => {
    // planeRef.current.lookAt(lookAtPosition);
    // console.log(lookAtPosition);
  });

  return (
    <mesh
      position={[0, 0, -8]}
      ref={planeRef}
      scale={[0.016 * aspect[0], 0.016 * aspect[1], 1]}
      onPointerMove={isMobile ? null : handlePointerMove}
      onClick={handleClick}
      visible={false}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="red" opacity={0.3} transparent />
    </mesh>
  );
};

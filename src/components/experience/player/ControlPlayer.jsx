import { PerspectiveCamera } from "@react-three/drei";
import { GunModel, triggerPosition } from "./GunModel";
import { useControls } from "leva";
import { useEffect, useRef, useState } from "react";
import { Projectile } from "./Projectile";
import { useAtom } from "jotai";
import { newShootTarget, ShootPanel } from "./ShootPanel";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RigidBody } from "@react-three/rapier";
import { DamageScreen } from "./DamageScreen";
import { playAudio } from "../../ui/Audio";

export const ControlPlayer = () => {
  const [position, setPosition] = useState([0, 0, 0]);
  const [projectiles, setProjectiles] = useState([]);
  const [shootTarget] = useAtom(newShootTarget);
  const [newTriggerPosition] = useAtom(triggerPosition);
  const [aspect, setAspect] = useState([]);
  const playerPosition = useRef(new THREE.Vector3());
  const gunRef = useRef();
  const [audioState, setAudioState] = useAtom(playAudio);

  const controls = useControls({
    positionProportion: {
      value: [-0.5, -0.3, -3],
      step: 0.1,
    },
    rotation: {
      value: [0.0, 3, 0],
      step: 0.1,
    },
  });

  const handleResize = () => {
    const { innerWidth, innerHeight } = window;
    const aspect = innerWidth / innerHeight;

    if (innerWidth > innerHeight) {
      controls.positionProportion[2] = -1;
      controls.rotation[1] = 3;
    } else {
      controls.positionProportion[2] = -3;
      controls.positionProportion[1] = -1.4;
      controls.positionProportion[0] = 0;
      controls.rotation[1] = 0;
    }

    setPosition([
      controls.positionProportion[0] * aspect,
      controls.positionProportion[1] * aspect,
      controls.positionProportion[2] * aspect,
    ]);
    setAspect([innerWidth, innerHeight]);

    console.log(controls.rotation);
  };

  const handleShoot = (targetPosition) => {
    setProjectiles((prev) => [
      ...prev,
      {
        id: Date.now(),
        startPosition: newTriggerPosition,
        targetPosition,
      },
    ]);
    setAudioState((prev) => ({
      ...prev,
      bubbleShoot: prev.bubbleShoot + 1,
    }));
  };

  useEffect(() => {
    if (shootTarget.x === 0 && shootTarget.y === 0 && shootTarget.z === 0) {
      return;
    }

    if (!shootTarget) return;
    handleShoot(shootTarget);
  }, [shootTarget]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [controls.positionProportion, controls.rotation]);

  useEffect(() => {
    gunRef.current.lookAt(new THREE.Vector3(0, 0, -15));
  }, []);

  useFrame(() => {
    playerPosition.current = gunRef.current.position;
  });

  return (
    <group>
      <PerspectiveCamera makeDefault position={[0, 0, 0]} ref={gunRef}>
        <GunModel position={position} rotation={controls.rotation} />
      </PerspectiveCamera>

      <ShootPanel aspect={aspect} lookAtPosition={playerPosition.current} />

      <DamageScreen />

      {projectiles.map((projectile) => (
        <Projectile
          key={projectile.id}
          startPosition={projectile.startPosition}
          targetPosition={projectile.targetPosition}
          onHit={() => {
            // console.log("Hit!");
            setProjectiles((prev) =>
              prev.filter((p) => p.id !== projectile.id)
            );
          }}
          onMiss={() => {
            // console.log("Miss!");
            setProjectiles((prev) =>
              prev.filter((p) => p.id !== projectile.id)
            );
          }}
        />
      ))}
    </group>
  );
};

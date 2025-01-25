import { PerspectiveCamera } from "@react-three/drei";
import { GunModel, triggerPosition } from "./GunModel";
import { useControls } from "leva";
import { useEffect, useRef, useState } from "react";
import { Projectile } from "./Projectile";
import { useAtom } from "jotai";
import { newShootTarget } from "../Experience";

export const ControlPlayer = () => {
  const [position, setPosition] = useState([0, 0, 0]);
  const [projectiles, setProjectiles] = useState([]);
  const [shootTarget] = useAtom(newShootTarget);
  const [newTriggerPosition] = useAtom(triggerPosition);
  const gunRef = useRef();

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
      // controls.positionProportion[0] = -0.3;
      // controls.positionProportion[1] = -0.3;
      controls.positionProportion[2] = -1;

      controls.rotation[1] = 3;
    } else {
      // controls.positionProportion[0] = -0.6;
      // controls.positionProportion[1] = -0.3;
      controls.positionProportion[2] = -3;

      controls.rotation[1] = 3;
    }

    setPosition([
      controls.positionProportion[0] * aspect,
      controls.positionProportion[1] * aspect,
      controls.positionProportion[2] * aspect,
    ]);
    // console.log(controls.positionProportion);
  };

  const handleShoot = (targetPosition) => {
    console.log(projectiles);

    setProjectiles((prev) => [
      ...prev,
      {
        id: Date.now(),
        startPosition: newTriggerPosition,
        targetPosition,
      },
    ]);

    console.log("Shoot!");
  };

  useEffect(() => {
    handleShoot(shootTarget);
  }, [shootTarget]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [controls.positionProportion, controls.rotation]);

  return (
    <group>
      <PerspectiveCamera makeDefault position={[3, 3, 3]} ref={gunRef}>
        <GunModel position={position} rotation={controls.rotation} />
      </PerspectiveCamera>

      {projectiles.map((projectile) => (
        <Projectile
          key={projectile.id}
          startPosition={projectile.startPosition}
          targetPosition={projectile.targetPosition}
          onHit={() => {
            console.log("Hit!");
            setProjectiles((prev) =>
              prev.filter((p) => p.id !== projectile.id)
            );
          }}
          onMiss={() => {
            console.log("Miss!");
            setProjectiles((prev) =>
              prev.filter((p) => p.id !== projectile.id)
            );
          }}
        />
      ))}
    </group>
  );
};

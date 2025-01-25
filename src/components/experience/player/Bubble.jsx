import { extend, useFrame } from "@react-three/fiber";
import { BubbleMaterial } from "../materials";
import { useControls } from "leva";
import { Color } from "three";
import { useRef } from "react";
import * as THREE from "three";

extend({ BubbleMaterial });

export const Bubble = () => {
  const { bubbleColor, uNoiseColorMultiplier } = useControls({
    bubbleColor: "white",
    uNoiseColorMultiplier: {
      value: [10, 4, 2],
      step: 1,
    },
  });

  const material = useRef();

  useFrame(({ clock }) => {
    material.current.uTime = clock.elapsedTime;
  });

  return (
    <group>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <bubbleMaterial
          ref={material}
          uColor={new Color(bubbleColor)}
          uNoiseColorMultiplier={uNoiseColorMultiplier}
          transparent
          side={2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

import { extend, useFrame } from "@react-three/fiber";
import { DamageMaterial } from "../materials";
import { useControls } from "leva";
import { Color } from "three";
import { useRef } from "react";
import * as THREE from "three";

extend({ DamageMaterial });

export const DamageScreen = (props) => {
  const { uColor, uAlpha } = useControls({
    uColor: "white",
    uAlpha: 0.0,
  });

  const material = useRef();

  // useFrame(({ clock }) => {
  //   material.current.uTime = clock.elapsedTime;
  // });

  return (
    <group {...props}>
      <mesh>
        <planeGeometry args={[2, 2]} />
        <damageMaterial
          ref={material}
          uColor={new Color(uColor)}
          uAlpha={uAlpha}
          transparent
        />
      </mesh>
    </group>
  );
};

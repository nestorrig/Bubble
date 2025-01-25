import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const speed = 0.1;

export const Projectile = ({
  startPosition = new THREE.Vector3(),
  targetPosition = new THREE.Vector3(),
  onHit,
  onMiss,
}) => {
  const ref = useRef();
  const position = useRef(new THREE.Vector3(...startPosition));
  const speed = 0.1;

  const direction = useMemo(() => {
    return new THREE.Vector3()
      .subVectors(new THREE.Vector3(...targetPosition), position.current)
      .normalize();
  }, [targetPosition]);

  useFrame(() => {
    if (!ref.current) return;

    position.current.add(direction.clone().multiplyScalar(speed));

    // if (position.current.distanceTo(new THREE.Vector3(...targetPosition)) < 0.1) {
    //   onHit();
    //   ref.current.scale.set(2, 2, 2); // Crece para rodear al enemigo
    // } else if (position.current.distanceTo(new THREE.Vector3(...targetPosition)) > 10) {
    //   onMiss();
    //   ref.current.visible = false; // Desmonta el proyectil
    // }

    ref.current.position.copy(position.current);
  });

  // useEffect(() => {
  //   console.log(startPosition);
  //   console.log(targetPosition);
  // }, []);

  return (
    <mesh ref={ref} position={position.current} scale={[0.1, 0.1, 0.1]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

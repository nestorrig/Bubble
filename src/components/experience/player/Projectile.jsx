import { useFrame } from "@react-three/fiber";
import { BallCollider, RigidBody } from "@react-three/rapier";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Bubble } from "./Bubble";

export const Projectile = ({
  startPosition = new THREE.Vector3(),
  targetPosition = new THREE.Vector3(),
  onHit,
  onMiss,
}) => {
  const meshRef = useRef();
  const rigidRef = useRef();
  const enemyRef = useRef();
  const position = useRef(new THREE.Vector3(...startPosition));
  const [isIntersected, setIsIntersected] = useState(false);
  const speed = 0.2;

  const direction = useMemo(() => {
    return new THREE.Vector3()
      .subVectors(new THREE.Vector3(...targetPosition), position.current)
      .normalize();
  }, [targetPosition]);

  const handleIntersection = (e) => {
    if (e.rigidBodyObject.name != "enemy") return;
    setIsIntersected(true);

    enemyRef.current = e.rigidBodyObject.children[0];
    const tl = gsap.timeline();

    tl.to(meshRef.current.scale, {
      duration: 0.5,
      x: 50,
      y: 50,
      z: 50,
    }).to(meshRef.current.position, {
      keyframes: {
        x: [
          meshRef.current.position.x,
          Math.floor(Math.random() * 30),
          Math.floor(Math.random() * 30),
          Math.floor(Math.random() * 30),
          Math.floor(Math.random() * 30),
        ],
        y: [meshRef.current.position.y, 100, 200, 300, 400],
        easeEach: "none",
        ease: "none",
      },
      duration: 5,
      ease: "none",
      onComplete: () => {
        // funcion para desmontar projectil y enemigo
      },
    });
  };

  useFrame(() => {
    if (rigidRef.current) {
      if (!isIntersected) {
        position.current.add(direction.clone().multiplyScalar(speed));

        rigidRef.current.setTranslation({
          x: position.current.x,
          y: position.current.y,
          z: position.current.z,
        });
      }
    }

    if (isIntersected && enemyRef.current) {
      const meshPosition = meshRef.current.getWorldPosition(
        new THREE.Vector3()
      );

      enemyRef.current.position.set(
        THREE.MathUtils.lerp(enemyRef.current.position.x, meshPosition.x, 0.5),
        THREE.MathUtils.lerp(
          enemyRef.current.position.y,
          meshPosition.y + 0.55,
          0.5
        ),
        THREE.MathUtils.lerp(enemyRef.current.position.z, meshPosition.z, 0.5)
      );

      enemyRef.current.rotation.y += 0.03;
      enemyRef.current.rotation.z = Math.sin(enemyRef.current.rotation.y);
      enemyRef.current.rotation.x = Math.cos(enemyRef.current.rotation.y);
    }
  });

  // useEffect(() => {
  //   console.log(startPosition);
  //   console.log(targetPosition);
  // }, []);

  return (
    // <group ref={ref} position={position.current}>
    <RigidBody
      type="dynamic" // dunciona el sensor pero se glitchea
      // type="Fixed" // no funciona el sensor, pero es perfomante
      // position={position.current}
      ref={rigidRef}
      colliders="ball"
      scale={[0.02, 0.02, 0.02]}
      onIntersectionEnter={handleIntersection}
      sensor
      gravityScale={0} // esto elimina la gravedad y el glitch
    >
      <group ref={meshRef}>
        <Bubble />
      </group>
    </RigidBody>
  );
};

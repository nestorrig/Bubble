import { useFrame } from "@react-three/fiber";
import { BallCollider, RigidBody, useRapier } from "@react-three/rapier";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Bubble } from "./Bubble";
import { atom, useAtom } from "jotai";
import { gameStateUI } from "../../ui/UI";

export const intersectedObjectNames = atom([]);
export const objectHitted = atom("");

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
  const rotation = useRef(new THREE.Vector3());
  const [isIntersected, setIsIntersected] = useState(false);
  const [intersectedObjects, setIntersectedObjects] = useAtom(
    intersectedObjectNames
  );
  const [hittedObject, setHittedObject] = useAtom(objectHitted);
  const [animationFinished, setAnimationFinished] = useState(false);
  const speed = 0.5;

  // atom for UI
  const [_, setGameState] = useAtom(gameStateUI);

  const direction = useMemo(() => {
    return new THREE.Vector3()
      .subVectors(new THREE.Vector3(...targetPosition), position.current)
      .normalize();
  }, [targetPosition]);

  const handleIntersection = (e) => {
    if (!e.rigidBodyObject.name.includes("enemy")) return;
    if (intersectedObjects.includes(e.rigidBodyObject.name)) return;
    setIsIntersected(true);
    setIntersectedObjects((prev) => [...prev, e.rigidBodyObject.name]);
    enemyRef.current = e.rigidBody;

    const tl = gsap.timeline();

    setGameState((prev) => ({
      ...prev,
      score: prev.score + 10,
    }));

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
      duration: 3,
      ease: "none",
      onComplete: () => {
        onHit();
        setAnimationFinished(true);
        setIntersectedObjects((prev) =>
          prev.filter((name) => name !== e.rigidBodyObject.name)
        );
        setHittedObject(e.rigidBodyObject.name);
        e.rigidBody.setRotation({
          x: 0,
          y: 0,
          z: 0,
          w: 1,
        });
      },
    });
  };

  useEffect(() => {
    const missTimeout = setTimeout(() => {
      if (!isIntersected) {
        onMiss();
        setAnimationFinished(true);
      }
    }, 2500);

    return () => clearTimeout(missTimeout);
  }, [isIntersected, onMiss]);

  useFrame(({ clock }) => {
    if (animationFinished) return;

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
      rotation.current.y += 0.03;
      rotation.current.z = Math.sin(rotation.current.y);
      rotation.current.x = Math.cos(rotation.current.y);

      enemyRef.current.setTranslation({
        x: meshPosition.x,
        y: meshPosition.y,
        z: meshPosition.z,
      });

      enemyRef.current.setRotation({
        w: rotation.current.x,
        x: rotation.current.x,
        y: rotation.current.y,
        z: rotation.current.z,
      });
    }
  });

  // useEffect(() => {
  //   console.log(startPosition);
  //   console.log(targetPosition);
  // }, []);

  return (
    <RigidBody
      type="dynamic"
      ref={rigidRef}
      colliders="ball"
      scale={[0.02, 0.02, 0.02]}
      onIntersectionEnter={handleIntersection}
      sensor
      gravityScale={0}
    >
      <group ref={meshRef}>
        <Bubble />
      </group>
    </RigidBody>
  );
};

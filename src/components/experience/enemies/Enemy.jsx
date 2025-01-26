import React, { useEffect, useMemo, useRef, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useControls } from "leva";
import { SkeletonUtils } from "three/examples/jsm/Addons.js";
import { useFrame, useGraph } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useAtom } from "jotai";
import { intersectedObjectNames, objectHitted } from "../player/Projectile";

export const Enemy = ({ name = "enemy" }) => {
  const position = useMemo(() => {
    return [THREE.MathUtils.randInt(-3, 3), -0.7, -15];
  }, []);
  const group = useRef();
  const { scene, animations } = useGLTF("./models/enemies/Enemy.glb");
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);
  const { actions } = useAnimations(animations, group);

  const { animation } = useControls({
    animation: {
      value: "CharacterArmature|Idle",
      options: Object.keys(actions),
    },
  });

  const [currentAnimation, setCurrentAnimation] = useState(
    "CharacterArmature|Idle"
  );

  useEffect(() => {
    if (actions[currentAnimation]) {
      actions[currentAnimation].reset().fadeIn(0.5).play();
    }
    return () => {
      if (actions[currentAnimation]) {
        actions[currentAnimation].fadeOut(0.5);
      }
    };
  }, [currentAnimation, actions]);

  // intervalos de animaciones
  const [speed, setSpeed] = useState(0);
  const [intersectedObjects] = useAtom(intersectedObjectNames);
  const [hittedObject] = useAtom(objectHitted);
  const rigidBodyObject = useRef();
  const timeoutRef = useRef();
  const rigidPosition = useRef(new THREE.Vector3(...position));
  const direction = useMemo(() => {
    return new THREE.Vector3()
      .subVectors(new THREE.Vector3(0, -0.65, 0), rigidPosition.current)
      .normalize();
  }, [new THREE.Vector3(0, -0.65, 0)]);

  const laps = useRef({
    idle: {
      name: "CharacterArmature|Idle",
      speed: 0,
    },
    walk: {
      name: "CharacterArmature|Walk",
      speed: 0.02,
    },
    run: {
      name: "CharacterArmature|Run",
      speed: 0.05,
    },
  });

  const interval = () => {
    const keys = Object.keys(laps.current);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const { name, speed } = laps.current[randomKey];
    const time = THREE.MathUtils.randFloat(2, 5);
    // console.log(name, time);

    setCurrentAnimation(name);
    setSpeed(speed);
    timeoutRef.current = setTimeout(() => {
      if (!intersectedObjects.includes(name)) {
        interval();
      }
    }, time * 1000);
  };

  useEffect(() => {
    if (!intersectedObjects.includes(name)) {
      // console.log("interval");

      interval();
    } else {
      // console.log("clear");

      setCurrentAnimation("CharacterArmature|Idle");
      setSpeed(0);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [intersectedObjects]);

  const handleNewPosition = () => {
    rigidPosition.current = new THREE.Vector3(
      THREE.MathUtils.randInt(-3, 3),
      -0.7,
      -15
    );
  };

  useEffect(() => {
    if (hittedObject === name) {
      handleNewPosition();
    }
  }, [hittedObject]);

  useFrame(() => {
    if (rigidBodyObject.current) {
      if (rigidPosition.current.distanceTo(new THREE.Vector3(0, -0.65, 0)) < 4)
        return;
      rigidPosition.current.add(direction.clone().multiplyScalar(speed));

      rigidBodyObject.current.setTranslation({
        x: rigidPosition.current.x,
        y: rigidPosition.current.y,
        z: rigidPosition.current.z,
      });
    }
  });

  return (
    <RigidBody
      type="fixed"
      colliders={false}
      position={position}
      name={name}
      ref={rigidBodyObject}
    >
      <group ref={group} position={[0, -0.35, 0]} dispose={null} name="Root">
        <group name="Root_Scene">
          <group name="RootNode">
            <group
              name="CharacterArmature"
              rotation={[-Math.PI / 2, 0, 0]}
              scale={100}
            >
              <primitive object={nodes.Root} />
            </group>
            <group
              name="Enemy_Robot_2Legs"
              rotation={[-Math.PI / 2, 0, 0]}
              scale={100}
            >
              <skinnedMesh
                castShadow
                receiveShadow
                name="Enemy_Robot_2Legs_1"
                geometry={nodes.Enemy_Robot_2Legs_1.geometry}
                material={materials.Main2}
                skeleton={nodes.Enemy_Robot_2Legs_1.skeleton}
              />
              <skinnedMesh
                castShadow
                receiveShadow
                name="Enemy_Robot_2Legs_2"
                geometry={nodes.Enemy_Robot_2Legs_2.geometry}
                material={materials.Main}
                skeleton={nodes.Enemy_Robot_2Legs_2.skeleton}
              />
              <skinnedMesh
                castShadow
                receiveShadow
                name="Enemy_Robot_2Legs_3"
                geometry={nodes.Enemy_Robot_2Legs_3.geometry}
                material={materials.Edge}
                skeleton={nodes.Enemy_Robot_2Legs_3.skeleton}
              />
              <skinnedMesh
                castShadow
                receiveShadow
                name="Enemy_Robot_2Legs_4"
                geometry={nodes.Enemy_Robot_2Legs_4.geometry}
                material={materials.Dark}
                skeleton={nodes.Enemy_Robot_2Legs_4.skeleton}
              />
              <skinnedMesh
                castShadow
                receiveShadow
                name="Enemy_Robot_2Legs_5"
                geometry={nodes.Enemy_Robot_2Legs_5.geometry}
                material={materials.Eye}
                skeleton={nodes.Enemy_Robot_2Legs_5.skeleton}
              />
            </group>
            <group
              visible={false} // Hide the cylinder
              name="Cylinder"
              position={[0, 0.754, 0.002]}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={13.18}
            >
              <skinnedMesh
                name="Cylinder_1"
                geometry={nodes.Cylinder_1.geometry}
                material={materials.Grey}
                skeleton={nodes.Cylinder_1.skeleton}
              />
              <skinnedMesh
                name="Cylinder_2"
                geometry={nodes.Cylinder_2.geometry}
                material={materials.LightGrey}
                skeleton={nodes.Cylinder_2.skeleton}
              />
            </group>
          </group>
        </group>
      </group>
      {/* <group>
      </group> */}
      <CuboidCollider args={[0.7, 0.35, 0.4]} position={[0, 0, 0]} />
    </RigidBody>
  );
};

useGLTF.preload("./models/enemies/Enemy.glb");

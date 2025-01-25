import { PerspectiveCamera } from "@react-three/drei";
import { GunModel } from "./GunModel";
import { useControls } from "leva";
import { useEffect, useState } from "react";

export const ControlPlayer = () => {
  const [position, setPosition] = useState([0, 0, 0]);

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

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [controls.positionProportion, controls.rotation]);

  return (
    <PerspectiveCamera makeDefault position={[3, 3, 3]}>
      <GunModel position={position} rotation={controls.rotation} />
    </PerspectiveCamera>
  );
};

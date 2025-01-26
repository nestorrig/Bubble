import { shaderMaterial } from "@react-three/drei";
import { Color } from "three";
import { ambientLight, directionalLight } from "./includes/lights";

export const DamageMaterial = shaderMaterial(
  {
    uColor: new Color(0.5, 0, 0).convertSRGBToLinear(),
    uAlpha: 0.0,
  },
  /*glsl*/ `

  void main()
  {
    gl_Position = vec4(position, 1.0);
  }
  `,
  /*glsl*/ `
  uniform vec3 uColor;
  uniform float uAlpha;

 

  void main()
  {
      gl_FragColor = vec4(uColor, uAlpha);
  }`
);

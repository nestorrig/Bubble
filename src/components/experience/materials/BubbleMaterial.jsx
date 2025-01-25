import { shaderMaterial } from "@react-three/drei";
import { Color } from "three";
import { ambientLight, directionalLight } from "../materials/includes/lights";

export const BubbleMaterial = shaderMaterial(
  {
    uColor: new Color("white"),
    uTime: 0,
    uNoiseColorMultiplier: [1, 1, 1],
  },
  /*glsl*/ `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying float vNoise;

  uniform float uTime;

  float random2D(vec2 value)
  {
    return fract(sin(dot(value.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  float noise(vec2 p){
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);

    float res = mix(
      mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
      mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
    return res*res;
  }

  void main()
  {
    // Position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // wobble
    vNoise = noise(modelPosition.xz + uTime);
    modelPosition.y += sin(vNoise) * 0.15;
    modelPosition.x += sin(vNoise) * 0.15;
    modelPosition.z += sin(vNoise) * 0.5;

    // Final position
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    // Model normal
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    // Varyings
    vPosition = modelPosition.xyz;
    vNormal = modelNormal.xyz;
  }`,
  /*glsl*/ `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vNoise;

  uniform float uTime;
  uniform vec3 uColor;
  uniform vec3 uNoiseColorMultiplier;

  ${ambientLight}
  ${directionalLight}

  void main() {

    // Normal
    vec3 normal = normalize(vNormal);
    if(!gl_FrontFacing) {
      normal *= -1.0;
    }

    vec3 color = uColor;
    vec3 lightColor = vec3(
      cos(vNoise * uNoiseColorMultiplier.x),
      cos(vNoise * uNoiseColorMultiplier.y),
      cos(vNoise * uNoiseColorMultiplier.z)
    );


    // Fresnel
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    float fresnel = dot(viewDirection, normal) + 1.0;
    fresnel = pow(fresnel, 1.0);
    fresnel /= 16.0;

    float fresnel2 = dot(viewDirection, normal) + 1.0;
    fresnel2 = pow(fresnel2, 2.0);
    // fresnel2 = smoothstep(0.1, 0.9, fresnel2);

    // light
    vec3 light = vec3(0.0);
    light += ambientLight(
        vec3(1.0),  // light color
        1.0       // light intensity
    );
    light += directionalLight(
        lightColor,  // light color
        6.0,                  // light intensity
        normal,               // normal
        vec3(-4.0, 10.0, 0.0),  // light position
        viewDirection,        // view direction
        20.0                  // specular power
    );
    light += directionalLight(
       lightColor,  // light color
        6.0,                  // light intensity
        normal,               // normal
        vec3(4.0, 10.0, 0.0),  // light position
        viewDirection,        // view direction
        20.0                  // specular power
    );
    color *= light;
    color *= fresnel;


    // Final color
    gl_FragColor = vec4(color, fresnel2);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`
);

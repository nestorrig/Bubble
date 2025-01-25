export const Lights = () => {
  return (
    <group>
      <ambientLight intensity={Math.PI / 2} />
      <directionalLight position={[4, 10, 0]} intensity={1} castShadow />
      <directionalLight position={[-4, 10, 0]} intensity={1} castShadow />
    </group>
  );
};

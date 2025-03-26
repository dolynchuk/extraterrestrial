import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import "./styles.css";
import { Cube } from "./models/Cube";
import { Spotlights } from "./models/Spotlights";

export function World() {
  const gridSize = 5;
  const spacing = 0.41; // Added spacing to prevent cubes from overlapping

  const cubes = Array.from({ length: gridSize * gridSize }, (_, index) => {
    const x = Math.floor(index / gridSize) - (gridSize - 1) / 2; // Center the grid
    const z = (index % gridSize) - (gridSize - 1) / 2; // Center the grid
    return (
      <Cube
        onClick={() => console.log('cube clicked')}
        variant={Math.random() > 0.5 ? 'Alien' : 'Aquapook'}
        key={`${x}-${z}`} 
        position={[x * spacing, 0, z * spacing]} 
      />
    );
  });


  return (
    <Canvas className="canvas" camera={{ position: [5, 5, 10], fov: 50 }}>
      <ambientLight intensity={10} />
      <Spotlights halfDepth={10} />
      <color attach="background" args={["black"]} />
      {cubes}
      <OrbitControls />
      {/* <Ground /> */}
    </Canvas>
  );
}
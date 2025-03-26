import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState } from "react";
import { Cube } from "./models/Cube";
import { Spotlights } from "./models/Spotlights";

const gridSize = 5;
const spacing = 0.41;
const variants = ["Alien", "Aquapook", "Atom", "Corals", "Cube", "Patrik", "Ufo"] as const;

type GridItem = {
  id: string;
  position: number[];
  variant: typeof variants[number];
};

export function World() {
  const [grid, setGrid] = useState(generateGrid());

  function generateGrid() {
    return Array.from({ length: gridSize * gridSize }, (_, index) => {
      const x = Math.floor(index / gridSize) - (gridSize - 1) / 2;
      const z = (index % gridSize) - (gridSize - 1) / 2;
      return {
        id: `${x}-${z}`,
        position: [x * spacing, 0, z * spacing],
        variant: variants[Math.floor(Math.random() * variants.length)],
      };
    });
  }

  function handleCubeClick(clickedCube: GridItem) {
    // Find matching cubes
    const matchingCubes = grid.filter(cube => cube.variant === clickedCube.variant);
    if (matchingCubes.length < 3) return;
    let newGrid = grid.filter(cube => cube.variant !== clickedCube.variant);
    setGrid([...newGrid]);
    setTimeout(() => {
      newGrid = newGrid.map(
        (cube) => ({ 
          ...cube, 
          position: [cube.position[0], cube.position[1] - spacing, cube.position[2]] 
        }
      ));
      setGrid([...newGrid]);
    }, 300);
    setTimeout(() => {
      const newCubes = matchingCubes.map(cube => ({
        id: cube.id,
        position: [cube.position[0], spacing * gridSize, cube.position[2]],
        variant: variants[Math.floor(Math.random() * variants.length)],
      }));
      setGrid([...newGrid, ...newCubes]);
    }, 600);
  }

  return (
    <Canvas className="canvas" camera={{ position: [5, 5, 10], fov: 50 }}>
      <ambientLight intensity={10} />
      <Spotlights halfDepth={10} />
      <color attach="background" args={["black"]} />
      {grid.map(cube => (
        <Cube
          key={cube.id}
          variant={cube.variant}
          position={cube.position}
          onClick={() => handleCubeClick(cube)}
        />
      ))}
      <OrbitControls />
    </Canvas>
  );
}

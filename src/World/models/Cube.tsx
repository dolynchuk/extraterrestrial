import { useGLTF } from "@react-three/drei";
import { BASE } from "../../constants";
import { MeshPhysicalMaterial, Color, Vector3, Group, Mesh } from "three";
import { ThreeElements, useFrame } from "@react-three/fiber";
import { useRef } from "react";

type Props = {
  position: number[];
  variant: 'Alien' | 'Aquapook' | 'Atom' | 'Corals' | 'Cube' | 'Patrik' | 'Ufo';
  onClick: (event: React.MouseEvent) => void;
};

const sceneCharacterMaterial = new MeshPhysicalMaterial({
  color: new Color(0xff0055),
  roughness: 0.7,
  metalness: 0.5,
  thickness: 1.5,
  ior: 1.5,
  clearcoat: 0.3,
  clearcoatRoughness: 0.8,
});

const glassMaterial = new MeshPhysicalMaterial({
  color: new Color(0xe6f0fa),
  roughness: 0.7,
  metalness: 0,
  transmission: 1,
  thickness: 1.5,
  ior: 1.5,
  clearcoat: 0.3,
  clearcoatRoughness: 0.8,
  reflectivity: 0.6,
  transparent: true,
  opacity: 0.85,
});

export function Cube({ position, onClick, variant }: Props) {
  const { scene } = useGLTF(`${BASE}models/Cube.gltf`);
  const { scene: sceneCharacter } = useGLTF(`${BASE}models/${variant}.gltf`);

  const characterRef = useRef<ThreeElements['primitive']>(null);

  const clonedScene = scene.clone();
  const clonedCharacterScene = sceneCharacter.clone();

  (clonedScene as Group).traverse((child) => {
    if (child instanceof Mesh) {
      child.material = glassMaterial;
    }
  });

  (sceneCharacter as Group).traverse((child) => {
    if (child instanceof Mesh) {
      child.material = sceneCharacterMaterial;
    }
  });

  clonedCharacterScene.scale.set(0.1, 0.1, 0.1);
  clonedCharacterScene.position.set(+25, 7, 7);

  const characterPosition = clonedCharacterScene.position.clone();

  useFrame((state) => {
    if (characterRef.current) {
      const time = state.clock.getElapsedTime();
      const initialPos: Vector3 = characterPosition || new Vector3();
      const xOffset = Math.sin(time * 0.3 + Math.random() * 2) * 1.5;
      const yOffset = Math.sin(time * 1.5 + Math.random()) * 2;
      const zOffset = Math.cos(time * 0.4 + Math.random() * 2) * 1.5;
      characterRef.current.position.set(
        initialPos.x + xOffset,
        initialPos.y + yOffset,
        initialPos.z + zOffset
      );
    }
  });

  const handleClick = (event: React.MouseEvent) => {
    onClick(event);
  };

  return (
    <group
      position={new Vector3(position[0], position[1], position[2])}
      scale={0.01}
      rotation={[0, 0, 0]}
      onClick={handleClick}
    >
      <primitive object={clonedScene} />
      <primitive ref={characterRef} object={clonedCharacterScene} />
    </group>
  );
}

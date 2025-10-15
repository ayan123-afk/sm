import React from 'react';

interface VerticalGardenProps {
  position: [number, number, number];
  width: number;
  height: number;
  depth: number;
}

export const VerticalGarden: React.FC<VerticalGardenProps> = ({
  position,
  width,
  height,
  depth
}) => {
  const planters = [];
  const planterHeight = 1;
  const spacing = 2;
  
  for (let y = 1; y < height; y += spacing) {
    planters.push(
      <mesh key={y} position={[0, y, 0]} castShadow>
        <boxGeometry args={[width, planterHeight, depth]} />
        <meshStandardMaterial color="#8fbc8f" />
      </mesh>
    );
    
    // Plants
    for (let i = 0; i < 3; i++) {
      const plantX = (Math.random() - 0.5) * width * 0.8;
      const plantZ = (Math.random() - 0.5) * depth * 0.8;
      
      planters.push(
        <mesh key={`plant-${y}-${i}`} position={[plantX, y + 0.8, plantZ]} castShadow>
          <coneGeometry args={[0.3, 1.5, 4]} />
          <meshStandardMaterial color="#228b22" />
        </mesh>
      );
    }
  }
  
  // Water pipes
  const pipePositions: [number, number, number][] = [
    [width/2, height/2, -depth/2 - 0.1],
    [width/2, height/2, depth/2 + 0.1],
  ];
  
  return (
    <group position={position}>
      {planters}
      {pipePositions.map((pos, index) => (
        <mesh key={`pipe-${index}`} position={pos} castShadow>
          <cylinderGeometry args={[0.1, 0.1, height, 8]} />
          <meshStandardMaterial color="#4682b4" />
        </mesh>
      ))}
    </group>
  );
};

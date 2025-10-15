import React from 'react';

interface WaterFilterProps {
  position: [number, number, number];
}

export const WaterFilter: React.FC<WaterFilterProps> = ({ position }) => {
  return (
    <group position={position} castShadow receiveShadow>
      {/* Main treatment tanks */}
      <mesh position={[-15, 4, 0]}>
        <cylinderGeometry args={[8, 8, 8, 16]} />
        <meshStandardMaterial color="#87ceeb" />
      </mesh>
      
      <mesh position={[0, 4, 0]}>
        <cylinderGeometry args={[10, 10, 8, 16]} />
        <meshStandardMaterial color="#4682b4" />
      </mesh>
      
      <mesh position={[15, 4, 0]}>
        <cylinderGeometry args={[8, 8, 8, 16]} />
        <meshStandardMaterial color="#87ceeb" />
      </mesh>
      
      {/* Pipes connecting tanks */}
      <mesh position={[-7.5, 8, 0]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[1, 1, 15, 8]} />
        <meshStandardMaterial color="#708090" />
      </mesh>
      
      <mesh position={[7.5, 8, 0]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[1, 1, 15, 8]} />
        <meshStandardMaterial color="#708090" />
      </mesh>
      
      {/* Outflow pipe */}
      <mesh position={[25, 2, -20]} rotation={[0, Math.PI/4, 0]}>
        <cylinderGeometry args={[2, 2, 30, 8]} />
        <meshStandardMaterial color="#2f4f4f" />
      </mesh>
    </group>
  );
};

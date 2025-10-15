import React from 'react';

interface CulturalCenterProps {
  position: [number, number, number];
}

export const CulturalCenter: React.FC<CulturalCenterProps> = ({ position }) => {
  return (
    <group position={position} castShadow receiveShadow>
      {/* Main building */}
      <mesh position={[0, 7.5, 0]}>
        <boxGeometry args={[60, 15, 80]} />
        <meshStandardMaterial color="#dda0dd" />
      </mesh>
      
      {/* Plaza */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[80, 100]} />
        <meshStandardMaterial color="#f0e68c" />
      </mesh>
      
      {/* Decorative elements */}
      <mesh position={[20, 8, 30]}>
        <sphereGeometry args={[5, 8, 6]} />
        <meshStandardMaterial color="#ffd700" />
      </mesh>
      
      <mesh position={[-20, 8, -30]}>
        <torusGeometry args={[4, 1, 8, 12]} />
        <meshStandardMaterial color="#ff69b4" />
      </mesh>
    </group>
  );
};

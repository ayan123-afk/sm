import React from 'react';
import { Building } from '../../lib/procgen/rules';
import { VerticalGarden } from '../elements/VerticalGarden';

interface BlockGeneratorProps {
  buildings: Building[];
}

export const BlockGenerator: React.FC<BlockGeneratorProps> = ({ buildings }) => {
  return (
    <group>
      {buildings.map((building) => (
        <BuildingWithGarden key={building.id} building={building} />
      ))}
    </group>
  );
};

const BuildingWithGarden: React.FC<{ building: Building }> = ({ building }) => {
  const color = getBuildingColor(building.zone);
  
  return (
    <group position={building.position} rotation={[0, building.rotation, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[building.width, building.height, building.depth]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {building.hasVerticalGarden && (
        <VerticalGarden 
          position={[building.width/2 + 1, 0, 0]}
          width={2}
          height={building.height}
          depth={building.depth}
        />
      )}
    </group>
  );
};

function getBuildingColor(zone: string): string {
  switch (zone) {
    case 'residential': return '#aec6cf';
    case 'commercial': return '#ff6961';
    case 'industrial': return '#cfcfc4';
    case 'civic': return '#77dd77';
    case 'green': return '#b19cd9';
    default: return '#cccccc';
  }
}

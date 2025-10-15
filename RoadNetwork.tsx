import React from 'react';
import { Road } from '../../lib/procgen/rules';

interface RoadNetworkProps {
  roads: Road[];
}

export const RoadNetwork: React.FC<RoadNetworkProps> = ({ roads }) => {
  return (
    <group>
      {roads.map((road, index) => (
        <RoadSegment key={index} road={road} />
      ))}
    </group>
  );
};

const RoadSegment: React.FC<{ road: Road }> = ({ road }) => {
  const [start, end] = road.points;
  const length = Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2));
  const angle = Math.atan2(end[1] - start[1], end[0] - start[0]);
  
  const color = road.type === 'arterial' ? '#333333' : 
                road.type === 'secondary' ? '#555555' : '#777777';
  
  return (
    <mesh
      position={[(start[0] + end[0]) / 2, 0.1, (start[1] + end[1]) / 2]}
      rotation={[0, angle, 0]}
    >
      <boxGeometry args={[length, 0.2, road.width]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

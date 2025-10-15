import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Building, Road } from '../../lib/procgen/rules';

interface PeopleAgentProps {
  buildings: Building[];
  roads: Road[];
  count?: number;
}

interface Agent {
  id: number;
  position: THREE.Vector3;
  target: THREE.Vector3;
  speed: number;
  type: 'pedestrian' | 'vehicle';
  color: string;
}

export const PeopleAgent: React.FC<PeopleAgentProps> = ({ 
  buildings, 
  roads, 
  count = 100 
}) => {
  const agentsRef = useRef<THREE.InstancedMesh>(null);
  
  const agents = useMemo(() => {
    const agentList: Agent[] = [];
    
    for (let i = 0; i < count; i++) {
      const residentialBuildings = buildings.filter(b => b.zone === 'residential');
      const commercialBuildings = buildings.filter(b => b.zone === 'commercial');
      
      const home = residentialBuildings[Math.floor(Math.random() * residentialBuildings.length)];
      const work = commercialBuildings[Math.floor(Math.random() * commercialBuildings.length)];
      
      agentList.push({
        id: i,
        position: new THREE.Vector3(
          home.position[0] + (Math.random() - 0.5) * home.width,
          1,
          home.position[2] + (Math.random() - 0.5) * home.depth
        ),
        target: new THREE.Vector3(
          work.position[0] + (Math.random() - 0.5) * work.width,
          1,
          work.position[2] + (Math.random() - 0.5) * work.depth
        ),
        speed: 0.5 + Math.random() * 1.5,
        type: Math.random() > 0.7 ? 'vehicle' : 'pedestrian',
        color: Math.random() > 0.7 ? '#ff4444' : '#4444ff'
      });
    }
    
    return agentList;
  }, [buildings, count]);
  
  useFrame((state, delta) => {
    if (!agentsRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    agents.forEach((agent, i) => {
      const matrix = new THREE.Matrix4();
      const active = Math.sin(time + agent.id) > 0; // Simulate day/night cycle
      
      if (active) {
        // Move toward target
        agent.position.lerp(agent.target, delta * agent.speed * 0.1);
        
        // If close to target, pick new target
        if (agent.position.distanceTo(agent.target) < 5) {
          const randomBuilding = buildings[Math.floor(Math.random() * buildings.length)];
          agent.target.set(
            randomBuilding.position[0] + (Math.random() - 0.5) * randomBuilding.width,
            1,
            randomBuilding.position[2] + (Math.random() - 0.5) * randomBuilding.depth
          );
        }
      } else {
        // Return home at night
        const homeBuildings = buildings.filter(b => b.zone === 'residential');
        const home = homeBuildings[agent.id % homeBuildings.length];
        const homePos = new THREE.Vector3(
          home.position[0],
          1,
          home.position[2]
        );
        agent.position.lerp(homePos, delta * agent.speed * 0.1);
      }
      
      matrix.setPosition(agent.position);
      agentsRef.current.setMatrixAt(i, matrix);
    });
    
    agentsRef.current.instanceMatrix.needsUpdate = true;
  });
  
  return (
    <instancedMesh ref={agentsRef} args={[undefined, undefined, count]} castShadow>
      <sphereGeometry args={[0.5, 4, 4]} />
      <meshStandardMaterial color="#ff4444" />
    </instancedMesh>
  );
};

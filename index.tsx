import React, { Suspense, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { CityGenerator, CityConfig } from '../lib/procgen/rules';
import { RoadNetwork } from '../components/generator/RoadNetwork';
import { BlockGenerator } from '../components/generator/BlockGenerator';
import { CulturalCenter } from '../components/elements/CulturalCenter';
import { WaterFilter } from '../components/elements/WaterFilter';
import { PeopleAgent } from '../components/agents/PeopleAgent';

export default function SmartCity() {
  const [seed] = useState(12345);
  const [showAgents, setShowAgents] = useState(true);
  const [showSensors, setShowSensors] = useState(false);
  
  const city = useMemo(() => {
    const config: CityConfig = {
      seed,
      width: 2000,
      height: 2000,
      population: 10000
    };
    
    const generator = new CityGenerator(config);
    generator.generate();
    return generator;
  }, [seed]);
  
  const stats = useMemo(() => {
    const residential = city.buildings.filter(b => b.zone === 'residential').length;
    const commercial = city.buildings.filter(b => b.zone === 'commercial').length;
    const verticalGardens = city.buildings.filter(b => b.hasVerticalGarden).length;
    
    return {
      totalBuildings: city.buildings.length,
      residential,
      commercial,
      verticalGardens,
      population: residential * 20 + commercial * 10
    };
  }, [city]);
  
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{ position: [1000, 800, 1000], fov: 50 }}
        shadows
      >
        <color attach="background" args={['#87CEEB']} />
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[1000, 1000, 500]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        <Suspense fallback={null}>
          {/* Ground */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[city.config.width, city.config.height]} />
            <meshStandardMaterial color="#90EE90" />
          </mesh>
          
          {/* City Components */}
          <RoadNetwork roads={city.roads} />
          <BlockGenerator buildings={city.buildings} />
          
          {/* Special Buildings */}
          <CulturalCenter position={[city.config.width/2, 0, city.config.height/2]} />
          <WaterFilter position={[city.config.width * 0.2, 0, city.config.height * 0.8]} />
          
          {/* People Agents */}
          {showAgents && (
            <PeopleAgent 
              buildings={city.buildings} 
              roads={city.roads} 
              count={200} 
            />
          )}
          
          {/* Sensors */}
          {showSensors && city.sensors.map(sensor => (
            <mesh key={sensor.id} position={sensor.position} castShadow>
              <sphereGeometry args={[2, 8, 6]} />
              <meshStandardMaterial 
                color={getSensorColor(sensor.type)} 
                emissive={getSensorColor(sensor.type)}
                emissiveIntensity={0.3}
              />
            </mesh>
          ))}
        </Suspense>
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={100}
          maxDistance={2000}
        />
        <Stats />
      </Canvas>
      
      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h2>Smart City Stats</h2>
        <p>Population: {stats.population.toLocaleString()}</p>
        <p>Total Buildings: {stats.totalBuildings}</p>
        <p>Residential: {stats.residential}</p>
        <p>Commercial: {stats.commercial}</p>
        <p>Vertical Gardens: {stats.verticalGardens}</p>
        
        <div style={{ marginTop: '20px' }}>
          <label>
            <input
              type="checkbox"
              checked={showAgents}
              onChange={(e) => setShowAgents(e.target.checked)}
            />
            Show Agents
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={showSensors}
              onChange={(e) => setShowSensors(e.target.checked)}
            />
            Show Sensors
          </label>
        </div>
        
        <p style={{ marginTop: '20px', fontSize: '12px', opacity: 0.7 }}>
          Seed: {seed}
        </p>
      </div>
    </div>
  );
}

function getSensorColor(type: string): string {
  switch (type) {
    case 'air_quality': return '#00ff00';
    case 'water_meter': return '#0000ff';
    case 'traffic_counter': return '#ffff00';
    case 'energy_node': return '#ff00ff';
    default: return '#ffffff';
  }
}

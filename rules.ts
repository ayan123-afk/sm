import { SeededRandom, createNoise } from './seed';

export interface CityConfig {
  seed: number;
  width: number;
  height: number;
  population: number;
}

export interface Zone {
  type: 'residential' | 'commercial' | 'industrial' | 'civic' | 'green';
  bounds: { x: number; y: number; width: number; height: number };
  density: number;
}

export interface Building {
  id: string;
  type: string;
  position: [number, number, number];
  rotation: number;
  width: number;
  depth: number;
  height: number;
  zone: string;
  hasVerticalGarden: boolean;
  meta?: {
    capacity?: number;
    staff?: number;
    energyUse?: number;
  };
}

export interface Road {
  type: 'arterial' | 'secondary' | 'pedestrian';
  points: [number, number][];
  width: number;
}

export interface Sensor {
  id: string;
  type: 'air_quality' | 'water_meter' | 'traffic_counter' | 'energy_node';
  position: [number, number, number];
  value: number;
}

export class CityGenerator {
  private rng: SeededRandom;
  private noise: any;
  private config: CityConfig;
  
  public zones: Zone[] = [];
  public roads: Road[] = [];
  public buildings: Building[] = [];
  public sensors: Sensor[] = [];
  
  constructor(config: CityConfig) {
    this.config = config;
    this.rng = new SeededRandom(config.seed);
    this.noise = createNoise(config.seed);
  }
  
  generate() {
    this.generateRoadNetwork();
    this.generateZones();
    this.generateBuildings();
    this.generateSensors();
  }
  
  private generateRoadNetwork() {
    // Generate 3-5 major arterial roads
    const numArterials = this.rng.randomInt(3, 5);
    
    // Horizontal arterials
    for (let i = 0; i < Math.floor(numArterials / 2); i++) {
      const y = this.rng.randomFloat(0.2, 0.8) * this.config.height;
      this.roads.push({
        type: 'arterial',
        points: [[0, y], [this.config.width, y]],
        width: 20
      });
    }
    
    // Vertical arterials
    for (let i = 0; i < Math.ceil(numArterials / 2); i++) {
      const x = this.rng.randomFloat(0.2, 0.8) * this.config.width;
      this.roads.push({
        type: 'arterial',
        points: [[x, 0], [x, this.config.height]],
        width: 20
      });
    }
    
    // Generate secondary streets
    const blockSize = 100;
    for (let x = blockSize; x < this.config.width; x += blockSize) {
      for (let y = blockSize; y < this.config.height; y += blockSize) {
        if (this.rng.random() > 0.3) {
          this.roads.push({
            type: 'secondary',
            points: [[x, y - blockSize/2], [x, y + blockSize/2]],
            width: 12
          });
        }
        if (this.rng.random() > 0.3) {
          this.roads.push({
            type: 'secondary',
            points: [[x - blockSize/2, y], [x + blockSize/2, y]],
            width: 12
          });
        }
      }
    }
  }
  
  private generateZones() {
    const zoneTypes: Zone['type'][] = ['residential', 'commercial', 'industrial', 'civic', 'green'];
    
    // Create zone grid
    const zoneSize = 400;
    for (let x = 0; x < this.config.width; x += zoneSize) {
      for (let y = 0; y < this.config.height; y += zoneSize) {
        const zoneNoise = this.noise.noise2D(x/1000, y/1000);
        let zoneType: Zone['type'];
        
        if (zoneNoise > 0.6) {
          zoneType = 'commercial';
        } else if (zoneNoise > 0.3) {
          zoneType = 'residential';
        } else if (zoneNoise > 0) {
          zoneType = 'industrial';
        } else if (zoneNoise > -0.2) {
          zoneType = 'green';
        } else {
          zoneType = 'civic';
        }
        
        this.zones.push({
          type: zoneType,
          bounds: { x, y, width: zoneSize, height: zoneSize },
          density: this.rng.randomFloat(0.3, 1.0)
        });
      }
    }
  }
  
  private generateBuildings() {
    const blockSize = 80;
    let buildingId = 0;
    
    for (const zone of this.zones) {
      for (let x = zone.bounds.x + 10; x < zone.bounds.x + zone.bounds.width - 10; x += blockSize) {
        for (let y = zone.bounds.y + 10; y < zone.bounds.y + zone.bounds.height - 10; y += blockSize) {
          if (this.rng.random() < zone.density * 0.8) {
            const height = buildingHeight(x, y, zone.type, this.config.seed);
            const hasVerticalGarden = zone.type !== 'industrial' && this.rng.random() < 0.4;
            
            this.buildings.push({
              id: `building-${buildingId++}`,
              type: this.getBuildingType(zone.type, height),
              position: [x, 0, y],
              rotation: this.rng.random() * Math.PI * 2,
              width: this.rng.randomFloat(15, 30),
              depth: this.rng.randomFloat(15, 30),
              height,
              zone: zone.type,
              hasVerticalGarden,
              meta: this.generateBuildingMeta(zone.type, height)
            });
          }
        }
      }
    }
    
    // Add special buildings
    this.generateSpecialBuildings();
  }
  
  private getBuildingType(zone: string, height: number): string {
    if (height <= 4) return 'low-rise';
    if (height <= 12) return 'mid-rise';
    return 'high-rise';
  }
  
  private generateBuildingMeta(zone: string, height: number) {
    switch (zone) {
      case 'residential':
        return { capacity: Math.floor(height * 2), energyUse: height * 100 };
      case 'commercial':
        return { capacity: Math.floor(height * 5), energyUse: height * 200 };
      case 'civic':
        return { capacity: Math.floor(height * 10), energyUse: height * 150, staff: Math.floor(height * 2) };
      default:
        return { capacity: Math.floor(height * 3), energyUse: height * 120 };
    }
  }
  
  private generateSpecialBuildings() {
    // Cultural Center
    this.buildings.push({
      id: 'cultural-center',
      type: 'cultural',
      position: [this.config.width/2, 0, this.config.height/2],
      rotation: 0,
      width: 60,
      depth: 80,
      height: 15,
      zone: 'civic',
      hasVerticalGarden: true,
      meta: { capacity: 2000, staff: 50, energyUse: 5000 }
    });
    
    // Water Treatment Center
    this.buildings.push({
      id: 'water-treatment',
      type: 'industrial',
      position: [this.config.width * 0.2, 0, this.config.height * 0.8],
      rotation: 0,
      width: 80,
      depth: 60,
      height: 8,
      zone: 'industrial',
      hasVerticalGarden: false,
      meta: { capacity: 10000, staff: 30, energyUse: 8000 }
    });
  }
  
  private generateSensors() {
    let sensorId = 0;
    
    // Distribute sensors throughout the city
    for (let i = 0; i < 50; i++) {
      const x = this.rng.randomFloat(0, this.config.width);
      const y = this.rng.randomFloat(0, this.config.height);
      const type = this.rng.choice(['air_quality', 'water_meter', 'traffic_counter', 'energy_node']);
      
      this.sensors.push({
        id: `sensor-${sensorId++}`,
        type: type as any,
        position: [x, 5, y],
        value: this.rng.randomFloat(0, 100)
      });
    }
  }
}

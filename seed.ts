import SimplexNoise from 'simplex-noise';
import seedrandom from 'seedrandom';

export function createRNG(seed: number) {
  return seedrandom(String(seed));
}

export function createNoise(seed: number) {
  return new SimplexNoise(String(seed));
}

export class SeededRandom {
  private rng: any;
  
  constructor(seed: number) {
    this.rng = createRNG(seed);
  }
  
  random(): number {
    return this.rng();
  }
  
  randomInt(min: number, max: number): number {
    return Math.floor(this.rng() * (max - min + 1)) + min;
  }
  
  randomFloat(min: number, max: number): number {
    return this.rng() * (max - min) + min;
  }
  
  choice<T>(array: T[]): T {
    return array[Math.floor(this.rng() * array.length)];
  }
}

// Example: determine building height based on noise + zone
export function buildingHeight(x: number, y: number, zone: string, seed: number) {
  const noise = createNoise(seed).noise2D(x/50, y/50);
  const base = zone === 'commercial' ? 8 : zone === 'residential' ? 4 : 6;
  return Math.max(1, Math.round(base + noise * 4));
}

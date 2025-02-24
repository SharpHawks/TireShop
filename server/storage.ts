import { type Tire, type InsertTire, type TireFilters } from "@shared/schema";

export interface IStorage {
  getTires(filters?: TireFilters): Promise<Tire[]>;
  getTire(id: number): Promise<Tire | undefined>;
}

export class MemStorage implements IStorage {
  private tires: Map<number, Tire>;
  private currentId: number;

  constructor() {
    this.tires = new Map();
    this.currentId = 1;
    this.initializeMockData();
  }

  private initializeMockData() {
    const mockImages = [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      "https://images.unsplash.com/photo-1556228578-567ba127e37f",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
      "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a",
      "https://images.unsplash.com/photo-1525904097878-94fb15835963",
    ];

    const mockTires: InsertTire[] = [
      {
        name: "EcoControl",
        brand: "Bridgestone",
        code: "MFS",
        size: "205/55R16",
        season: "summer",
        fuelEfficiency: "A",
        wetGrip: "B",
        noiseLevel: 68,
        price: 12999,
        inStock: true,
        imageUrl: mockImages[0],
      },
      {
        name: "SportContact",
        brand: "Continental",
        code: "RSC",
        size: "225/45R17",
        season: "summer",
        fuelEfficiency: "B",
        wetGrip: "A",
        noiseLevel: 72,
        price: 15999,
        inStock: true,
        imageUrl: mockImages[1],
      },
      {
        name: "PilotSport",
        brand: "Michelin",
        code: "XL",
        size: "245/40R18",
        season: "winter",
        fuelEfficiency: "C",
        wetGrip: "B",
        noiseLevel: 71,
        price: 18999,
        inStock: false,
        imageUrl: mockImages[2],
      },
      {
        name: "P Zero",
        brand: "Pirelli",
        code: "SOUND",
        size: "255/35R19",
        season: "summer",
        fuelEfficiency: "B",
        wetGrip: "A",
        noiseLevel: 69,
        price: 21999,
        inStock: true,
        imageUrl: mockImages[3],
      },
    ];

    mockTires.forEach((tire) => {
      const id = this.currentId++;
      this.tires.set(id, { ...tire, id });
    });
  }

  async getTires(filters?: TireFilters): Promise<Tire[]> {
    let tires = Array.from(this.tires.values());

    if (filters) {
      // Filter by size components
      if (filters.width || filters.aspect || filters.diameter) {
        tires = tires.filter((tire) => {
          // Parse size string (format: "205/55R16")
          const [width, rest] = tire.size.split('/');
          const [aspect, diameter] = rest.split('R');

          // Match individual components if specified
          if (filters.width && width !== filters.width) return false;
          if (filters.aspect && aspect !== filters.aspect) return false;
          if (filters.diameter && diameter !== filters.diameter) return false;

          return true;
        });
      }

      if (filters.inStock !== undefined) {
        tires = tires.filter((t) => t.inStock === filters.inStock);
      }
      if (filters.code) {
        tires = tires.filter((t) => t.code === filters.code);
      }
      if (filters.season) {
        tires = tires.filter((t) => t.season === filters.season);
      }
      if (filters.fuelEfficiency) {
        tires = tires.filter((t) => t.fuelEfficiency === filters.fuelEfficiency);
      }
      if (filters.wetGrip) {
        tires = tires.filter((t) => t.wetGrip === filters.wetGrip);
      }
      if (filters.maxNoiseLevel) {
        tires = tires.filter((t) => t.noiseLevel <= filters.maxNoiseLevel!);
      }
    }

    return tires;
  }

  async getTire(id: number): Promise<Tire | undefined> {
    return this.tires.get(id);
  }
}

export const storage = new MemStorage();
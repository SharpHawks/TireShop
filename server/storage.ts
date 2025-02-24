import type { Tire, InsertTire, TireFilters, User, InsertUser, Brand, InsertBrand, Model, InsertModel } from "@shared/schema";
import { tires, users, brands, models } from "@shared/schema";
import { eq, like, and, desc } from "drizzle-orm";
import { db } from "./db";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getTires(filters?: TireFilters): Promise<Tire[]>;
  getTire(id: number): Promise<Tire | undefined>;
  createTire(tire: InsertTire, userId: number): Promise<Tire>;
  updateTire(id: number, tire: Partial<InsertTire>): Promise<Tire | undefined>;
  deleteTire(id: number): Promise<boolean>;

  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Brand operations
  getBrands(): Promise<Brand[]>;
  getBrand(id: number): Promise<Brand | undefined>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  updateBrand(id: number, brand: Partial<InsertBrand>): Promise<Brand | undefined>;
  deleteBrand(id: number): Promise<boolean>;

  // Model operations
  getModels(brandId?: number): Promise<Model[]>;
  getModel(id: number): Promise<Model | undefined>;
  createModel(model: InsertModel): Promise<Model>;
  updateModel(id: number, model: Partial<InsertModel>): Promise<Model | undefined>;
  deleteModel(id: number): Promise<boolean>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true,
    });
  }

  async getTires(filters?: TireFilters): Promise<Tire[]> {
    let query = db.select().from(tires);

    if (filters) {
      const conditions = [];

      // Size filters
      if (filters.width || filters.aspect || filters.diameter) {
        if (filters.width) conditions.push(like(tires.size, `${filters.width}/%`));
        if (filters.aspect) conditions.push(like(tires.size, `%/${filters.aspect}R%`));
        if (filters.diameter) conditions.push(like(tires.size, `%R${filters.diameter}`));
      }

      // Boolean filters
      if (filters.inStock === true) {
        conditions.push(eq(tires.inStock, true));
      }

      // String filters
      if (filters.code) conditions.push(eq(tires.code, filters.code));
      if (filters.season) conditions.push(eq(tires.season, filters.season));
      if (filters.fuelEfficiency) conditions.push(eq(tires.fuelEfficiency, filters.fuelEfficiency));
      if (filters.wetGrip) conditions.push(eq(tires.wetGrip, filters.wetGrip));

      // Numeric filters
      if (filters.maxNoiseLevel) {
        conditions.push(eq(tires.noiseLevel, filters.maxNoiseLevel));
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
    }

    return await query;
  }

  async getTire(id: number): Promise<Tire | undefined> {
    const [tire] = await db.select().from(tires).where(eq(tires.id, id));
    return tire;
  }

  async createTire(tire: InsertTire, userId: number): Promise<Tire> {
    const [newTire] = await db
      .insert(tires)
      .values({
        ...tire,
        createdById: userId,
      })
      .returning();
    return newTire;
  }

  async updateTire(id: number, tire: Partial<InsertTire>): Promise<Tire | undefined> {
    const [updatedTire] = await db
      .update(tires)
      .set({
        ...tire,
        updatedAt: new Date(),
      })
      .where(eq(tires.id, id))
      .returning();
    return updatedTire;
  }

  async deleteTire(id: number): Promise<boolean> {
    const [deletedTire] = await db
      .delete(tires)
      .where(eq(tires.id, id))
      .returning();
    return !!deletedTire;
  }

  // Brand operations
  async getBrands(): Promise<Brand[]> {
    return db.select().from(brands).orderBy(desc(brands.name));
  }

  async getBrand(id: number): Promise<Brand | undefined> {
    const [brand] = await db.select().from(brands).where(eq(brands.id, id));
    return brand;
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const [newBrand] = await db
      .insert(brands)
      .values(brand)
      .returning();
    return newBrand;
  }

  async updateBrand(id: number, brand: Partial<InsertBrand>): Promise<Brand | undefined> {
    const [updatedBrand] = await db
      .update(brands)
      .set({
        ...brand,
        updatedAt: new Date(),
      })
      .where(eq(brands.id, id))
      .returning();
    return updatedBrand;
  }

  async deleteBrand(id: number): Promise<boolean> {
    const [deletedBrand] = await db
      .delete(brands)
      .where(eq(brands.id, id))
      .returning();
    return !!deletedBrand;
  }

  // Model operations
  async getModels(brandId?: number): Promise<Model[]> {
    let query = db.select().from(models).orderBy(desc(models.name));

    if (brandId !== undefined) {
      query = query.where(eq(models.brandId, brandId));
    }

    return await query;
  }

  async getModel(id: number): Promise<Model | undefined> {
    const [model] = await db.select().from(models).where(eq(models.id, id));
    return model;
  }

  async createModel(model: InsertModel): Promise<Model> {
    const [newModel] = await db
      .insert(models)
      .values(model)
      .returning();
    return newModel;
  }

  async updateModel(id: number, model: Partial<InsertModel>): Promise<Model | undefined> {
    const [updatedModel] = await db
      .update(models)
      .set({
        ...model,
        updatedAt: new Date(),
      })
      .where(eq(models.id, id))
      .returning();
    return updatedModel;
  }

  async deleteModel(id: number): Promise<boolean> {
    const [deletedModel] = await db
      .delete(models)
      .where(eq(models.id, id))
      .returning();
    return !!deletedModel;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db
      .insert(users)
      .values(user)
      .returning();
    return newUser;
  }
}

export const storage = new DatabaseStorage();
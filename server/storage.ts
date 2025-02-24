import type { Tire, InsertTire, TireFilters, User, InsertUser } from "@shared/schema";
import { tires, users } from "@shared/schema";
import { eq, like } from "drizzle-orm";
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
      // Size filters
      if (filters.width || filters.aspect || filters.diameter) {
        query = query.where(({ and, like }) => 
          and(
            filters.width ? like(tires.size, `${filters.width}/%`) : undefined,
            filters.aspect ? like(tires.size, `%/${filters.aspect}R%`) : undefined,
            filters.diameter ? like(tires.size, `%R${filters.diameter}`) : undefined,
          )
        );
      }

      // Boolean filters
      if (filters.inStock === true) {
        query = query.where(eq(tires.inStock, true));
      }

      // String filters
      if (filters.code) {
        query = query.where(eq(tires.code, filters.code));
      }
      if (filters.season) {
        query = query.where(eq(tires.season, filters.season));
      }
      if (filters.fuelEfficiency) {
        query = query.where(eq(tires.fuelEfficiency, filters.fuelEfficiency));
      }
      if (filters.wetGrip) {
        query = query.where(eq(tires.wetGrip, filters.wetGrip));
      }

      // Numeric filters
      if (filters.maxNoiseLevel) {
        query = query.where(({ lte }) => lte(tires.noiseLevel, filters.maxNoiseLevel!));
      }
    }

    return query;
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
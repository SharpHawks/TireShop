import { mysqlTable, varchar, int, boolean, timestamp } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const brands = mysqlTable("brands", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const models = mysqlTable("models", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  brandId: int("brand_id").notNull().references(() => brands.id),
  season: int("season").notNull(), // 1 for summer, 2 for winter
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const tires = mysqlTable("tires", {
  id: int("id").primaryKey().autoincrement(),
  modelId: int("model_id").notNull().references(() => models.id),
  code: varchar("code", { length: 50 }).notNull(), // e.g. 'MFS', 'RSC'
  size: varchar("size", { length: 50 }).notNull(), // e.g. '205/55R16'
  fuelEfficiency: varchar("fuel_efficiency", { length: 1 }).notNull(), // A to G rating
  wetGrip: varchar("wet_grip", { length: 1 }).notNull(), // A to G rating
  noiseLevel: int("noise_level").notNull(), // in decibels
  price: int("price").notNull(), // in cents
  inStock: boolean("in_stock").notNull(),
  imageUrl: varchar("image_url", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdById: int("created_by_id").references(() => users.id),
});

// Relations
export const tiresRelations = relations(tires, ({ one }) => ({
  model: one(models, {
    fields: [tires.modelId],
    references: [models.id],
  }),
  createdBy: one(users, {
    fields: [tires.createdById],
    references: [users.id],
  }),
}));

export const modelsRelations = relations(models, ({ one, many }) => ({
  brand: one(brands, {
    fields: [models.brandId],
    references: [brands.id],
  }),
  tires: many(tires),
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  models: many(models),
}));

export const usersRelations = relations(users, ({ many }) => ({
  tires: many(tires),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users)
  .extend({
    password: z.string().min(6, "Password must be at least 6 characters"),
  })
  .omit({ id: true, createdAt: true, isAdmin: true });

export const insertBrandSchema = createInsertSchema(brands).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertModelSchema = createInsertSchema(models)
  .extend({
    season: z.number().min(1).max(2),
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

export const insertTireSchema = createInsertSchema(tires)
  .extend({
    price: z.string()
      .transform((val) => Math.round(parseFloat(val) * 100)),
  })
  .omit({ 
    id: true, 
    createdAt: true, 
    updatedAt: true,
    createdById: true,
  });

// Filter schema
export const tireFilters = z.object({
  width: z.string().optional(),
  aspect: z.string().optional(),
  diameter: z.string().optional(),
  inStock: z.boolean().optional(),
  code: z.string().optional(),
  modelSeason: z.number().min(1).max(2).optional(),
  fuelEfficiency: z.string().optional(),
  wetGrip: z.string().optional(),
  maxNoiseLevel: z.number().optional(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Brand = typeof brands.$inferSelect;
export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type Model = typeof models.$inferSelect;
export type InsertModel = z.infer<typeof insertModelSchema>;
export type Tire = typeof tires.$inferSelect;
export type InsertTire = z.infer<typeof insertTireSchema>;
export type TireFilters = z.infer<typeof tireFilters>;
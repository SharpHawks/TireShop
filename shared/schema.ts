import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const models = pgTable("models", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brandId: integer("brand_id").notNull().references(() => brands.id),
  season: integer("season").notNull(), // 1 for summer, 2 for winter
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const tires = pgTable("tires", {
  id: serial("id").primaryKey(),
  modelId: integer("model_id").notNull().references(() => models.id),
  code: text("code").notNull(), // e.g. 'MFS', 'RSC'
  size: text("size").notNull(), // e.g. '205/55R16'
  fuelEfficiency: text("fuel_efficiency").notNull(), // A to G rating
  wetGrip: text("wet_grip").notNull(), // A to G rating
  noiseLevel: integer("noise_level").notNull(), // in decibels
  price: integer("price").notNull(), // in cents
  inStock: boolean("in_stock").notNull(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdById: integer("created_by_id").references(() => users.id),
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

// Schemas for insert operations
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
    season: z.number().min(1).max(2), // 1 for summer, 2 for winter
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

export const insertTireSchema = createInsertSchema(tires)
  .extend({
    price: z.string()
      .transform((val) => Math.round(parseFloat(val) * 100)), // Convert dollar amount to cents
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
  modelSeason: z.number().min(1).max(2).optional(), // Filter by model season
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
import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tires = pgTable("tires", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  code: text("code").notNull(), // e.g. 'MFS', 'RSC'
  size: text("size").notNull(), // e.g. '205/55R16'
  fuelEfficiency: text("fuel_efficiency").notNull(), // A to G rating
  wetGrip: text("wet_grip").notNull(), // A to G rating
  noiseLevel: integer("noise_level").notNull(), // in decibels
  price: integer("price").notNull(), // in cents
  inStock: boolean("in_stock").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const insertTireSchema = createInsertSchema(tires).omit({ id: true });

export type InsertTire = z.infer<typeof insertTireSchema>;
export type Tire = typeof tires.$inferSelect;

export const tireFilters = z.object({
  width: z.string().optional(),
  aspect: z.string().optional(),
  diameter: z.string().optional(),
  inStock: z.boolean().optional(),
  code: z.string().optional(),
  fuelEfficiency: z.string().optional(),
  wetGrip: z.string().optional(),
  maxNoiseLevel: z.number().optional(),
});

export type TireFilters = z.infer<typeof tireFilters>;
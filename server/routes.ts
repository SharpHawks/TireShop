import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { tireFilters } from "@shared/schema";

export async function registerRoutes(app: Express) {
  app.get("/api/tires", async (req, res) => {
    try {
      // Convert string 'true'/'false' to boolean for inStock
      const queryParams = { ...req.query };
      if (queryParams.inStock !== undefined) {
        queryParams.inStock = queryParams.inStock === 'true';
      }

      const filters = tireFilters.parse(queryParams);
      const tires = await storage.getTires(filters);
      res.json(tires);
    } catch (error) {
      console.error('Error processing tire filters:', error);
      res.status(400).json({ error: 'Invalid filter parameters' });
    }
  });

  app.get("/api/tires/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const tire = await storage.getTire(id);

    if (!tire) {
      res.status(404).json({ message: "Tire not found" });
      return;
    }

    res.json(tire);
  });

  return createServer(app);
}
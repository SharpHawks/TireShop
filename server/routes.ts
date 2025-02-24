import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { tireFilters } from "@shared/schema";

export async function registerRoutes(app: Express) {
  app.get("/api/tires", async (req, res) => {
    const filters = tireFilters.parse(req.query);
    const tires = await storage.getTires(filters);
    res.json(tires);
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

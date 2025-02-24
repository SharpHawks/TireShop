import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { tireFilters, insertTireSchema } from "@shared/schema";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express) {
  const { requireAdmin } = setupAuth(app);

  // Public tire routes
  app.get("/api/tires", async (req, res) => {
    try {
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

  // Admin-only tire management routes
  app.post("/api/tires", requireAdmin, async (req, res) => {
    try {
      const tireData = insertTireSchema.parse(req.body);
      const tire = await storage.createTire(tireData, req.user.id);
      res.status(201).json(tire);
    } catch (error) {
      console.error('Error creating tire:', error);
      res.status(400).json({ error: 'Invalid tire data' });
    }
  });

  app.patch("/api/tires/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tire = await storage.updateTire(id, req.body);

      if (!tire) {
        res.status(404).json({ message: "Tire not found" });
        return;
      }

      res.json(tire);
    } catch (error) {
      console.error('Error updating tire:', error);
      res.status(400).json({ error: 'Invalid tire data' });
    }
  });

  app.delete("/api/tires/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTire(id);

      if (!success) {
        res.status(404).json({ message: "Tire not found" });
        return;
      }

      res.sendStatus(204);
    } catch (error) {
      console.error('Error deleting tire:', error);
      res.status(500).json({ error: 'Failed to delete tire' });
    }
  });

  app.post("/api/recommendations", async (req, res) => {
    try {
      const userPreferences = req.body;
      console.log('Received preferences:', userPreferences); // Add logging

      const availableTires = await storage.getTires({});
      const recommendations = await getTireRecommendations(userPreferences, availableTires);

      console.log('Generated recommendations:', recommendations); // Add logging
      res.json(recommendations);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      res.status(500).json({ error: 'Failed to get recommendations' });
    }
  });

  return createServer(app);
}
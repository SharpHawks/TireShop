import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { tireFilters, insertTireSchema, insertBrandSchema, insertModelSchema } from "@shared/schema";
import { setupAuth } from "./auth";
import { getHealthMonitor } from "./services/health";

export async function registerRoutes(app: Express) {
  const { requireAdmin } = setupAuth(app);

  // Add health check endpoint
  app.get("/api/health/database", requireAdmin, async (req, res) => {
    const monitor = getHealthMonitor();
    if (!monitor) {
      res.status(500).json({ error: "Health monitoring not initialized" });
      return;
    }

    try {
      const health = await monitor.checkHealth();
      res.json(health);
    } catch (error) {
      console.error('Error checking database health:', error);
      res.status(500).json({ error: 'Failed to check database health' });
    }
  });

  // Brand management routes
  app.get("/api/brands", async (req, res) => {
    try {
      const brands = await storage.getBrands();
      res.json(brands);
    } catch (error) {
      console.error('Error fetching brands:', error);
      res.status(500).json({ error: 'Failed to fetch brands' });
    }
  });

  app.post("/api/brands", requireAdmin, async (req, res) => {
    try {
      const brandData = insertBrandSchema.parse(req.body);
      const brand = await storage.createBrand(brandData);
      res.status(201).json(brand);
    } catch (error) {
      console.error('Error creating brand:', error);
      res.status(400).json({ error: 'Invalid brand data' });
    }
  });

  app.patch("/api/brands/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const brand = await storage.updateBrand(id, req.body);

      if (!brand) {
        res.status(404).json({ message: "Brand not found" });
        return;
      }

      res.json(brand);
    } catch (error) {
      console.error('Error updating brand:', error);
      res.status(400).json({ error: 'Invalid brand data' });
    }
  });

  app.delete("/api/brands/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBrand(id);

      if (!success) {
        res.status(404).json({ message: "Brand not found" });
        return;
      }

      res.sendStatus(204);
    } catch (error) {
      console.error('Error deleting brand:', error);
      res.status(500).json({ error: 'Failed to delete brand' });
    }
  });

  // Model management routes
  app.get("/api/models", async (req, res) => {
    try {
      const models = await storage.getModels();
      res.json(models);
    } catch (error) {
      console.error('Error fetching models:', error);
      res.status(500).json({ error: 'Failed to fetch models' });
    }
  });

  app.get("/api/brands/:brandId/models", async (req, res) => {
    try {
      const brandId = parseInt(req.params.brandId);
      const models = await storage.getModels(brandId);
      res.json(models);
    } catch (error) {
      console.error('Error fetching models:', error);
      res.status(500).json({ error: 'Failed to fetch models' });
    }
  });

  app.post("/api/models", requireAdmin, async (req, res) => {
    try {
      const modelData = insertModelSchema.parse(req.body);
      const model = await storage.createModel(modelData);
      res.status(201).json(model);
    } catch (error) {
      console.error('Error creating model:', error);
      res.status(400).json({ error: 'Invalid model data' });
    }
  });

  app.patch("/api/models/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const model = await storage.updateModel(id, req.body);

      if (!model) {
        res.status(404).json({ message: "Model not found" });
        return;
      }

      res.json(model);
    } catch (error) {
      console.error('Error updating model:', error);
      res.status(400).json({ error: 'Invalid model data' });
    }
  });

  app.delete("/api/models/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteModel(id);

      if (!success) {
        res.status(404).json({ message: "Model not found" });
        return;
      }

      res.sendStatus(204);
    } catch (error) {
      console.error('Error deleting model:', error);
      res.status(500).json({ error: 'Failed to delete model' });
    }
  });

  // Public tire routes
  app.get("/api/tires", async (req, res) => {
    try {
      const filters = tireFilters.parse({
        ...req.query,
        inStock: req.query.inStock === 'true'
      });
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
      if (!req.user?.id) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }
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

  return createServer(app);
}
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertHealthcareProviderSchema,
  insertEhrSystemSchema,
  insertDataFetchHistorySchema
} from "../shared/schema";
import { z } from "zod";
import { ZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for Healthcare Providers
  app.get("/api/providers", async (req, res) => {
    try {
      const providers = await storage.getAllHealthcareProviders();
      res.json(providers);
    } catch (error) {
      console.error("Error fetching providers:", error);
      res.status(500).json({ message: "Failed to fetch healthcare providers" });
    }
  });

  // app.get("/api/providers/:id", async (req, res) => {
  //   try {
  //     const id = req.params.id;
  //     const provider = await storage.getHealthcareProvider(id);
      
  //     if (!provider) {
  //       return res.status(404).json({ message: "Healthcare provider not found" });
  //     }
      
  //     res.json(provider);
  //   } catch (error) {
  //     console.error("Error fetching provider:", error);
  //     res.status(500).json({ message: "Failed to fetch healthcare provider" });
  //   }
  // });

  app.post("/api/providers", async (req, res) => {
    try {
      const providerData = insertHealthcareProviderSchema.parse(req.body);
      const newProvider = await storage.createHealthcareProvider(providerData);
      res.status(201).json(newProvider);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("Error creating provider:", error);
      res.status(500).json({ message: "Failed to create healthcare provider" });
    }
  });

  app.put("/api/providers/:id", async (req, res) => {
    // code to update provider
  });

  app.delete("/api/providers/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const success = await storage.deleteHealthcareProvider(id);
      
      if (!success) {
        return res.status(404).json({ message: "Healthcare provider not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting provider:", error);
      res.status(500).json({ message: "Failed to delete healthcare provider" });
    }
  });

  // API routes for EHR Systems
  app.get("/api/ehr-systems", async (req, res) => {
    try {
      const systems = await storage.getAllEhrSystems();
      res.json(systems);
    } catch (error) {
      console.error("Error fetching EHR systems:", error);
      res.status(500).json({ message: "Failed to fetch EHR systems" });
    }
  });
  
  app.post("/api/ehr-systems", async (req, res) => {
    try {
      const systemData = insertEhrSystemSchema.parse(req.body);
      const newSystem = await storage.createEhrSystem(systemData);
      res.status(201).json(newSystem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("Error creating EHR system:", error);
      res.status(500).json({ message: "Failed to create EHR system" });
    }
  });

  // app.get("/api/ehr-systems/:id", async (req, res) => {
  //   try {
  //     const id = req.params.id;
  //     const system = await storage.getEhrSystem(id);
      
  //     if (!system) {
  //       return res.status(404).json({ message: "EHR system not found" });
  //     }
      
  //     res.json(system);
  //   } catch (error) {
  //     console.error("Error fetching EHR system:", error);
  //     res.status(500).json({ message: "Failed to fetch EHR system" });
  //   }
  // });

  app.put("/api/ehr-systems/:id", async (req, res) => {
    // code to update ehr detail
    console.log("Under construction!")
  });
  
  // app.patch("/api/ehr-systems/:id", async (req, res) => {
  //   try {
  //     const id = req.params.id;
      
  //     // Parse only the isSupported field
  //     const updateSchema = z.object({
  //       isSupported: z.boolean()
  //     });
      
  //     const { isSupported } = updateSchema.parse(req.body);
  //     const updatedSystem = await storage.updateEhrSystem(id, { isSupported });
      
  //     if (!updatedSystem) {
  //       return res.status(404).json({ message: "EHR system not found" });
  //     }
      
  //     res.json(updatedSystem);
  //   } catch (error) {
  //     if (error instanceof z.ZodError) {
  //       return res.status(400).json({ 
  //         message: "Validation error", 
  //         errors: error.errors 
  //       });
  //     }
  //     console.error("Error updating EHR system support status:", error);
  //     res.status(500).json({ message: "Failed to update EHR system support status" });
  //   }
  // });

  // API routes for Data Fetch History
  app.get("/api/data-history", async (req, res) => {
    try {
      const history = await storage.getAllDataFetchHistory();
      res.json(history);
    } catch (error) {
      console.error("Error fetching data history:", error);
      res.status(500).json({ message: "Failed to fetch data fetch history" });
    }
  });

  // app.get("/api/data-history/provider/:providerId", async (req, res) => {
  //   try {
  //     const providerId = req.params.providerId;
  //     const history = await storage.getDataFetchHistoryByProviderId(providerId);
  //     res.json(history);
  //   } catch (error) {
  //     console.error("Error fetching data history for provider:", error);
  //     res.status(500).json({ message: "Failed to fetch data fetch history for provider" });
  //   }
  // });

  app.post("/api/data-history", async (req, res) => {
    try {
      const historyData = insertDataFetchHistorySchema.parse(req.body);
      const newHistory = await storage.createDataFetchHistory(historyData);
      res.status(201);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error("Error creating data history record:", error);
      res.status(500).json({ message: "Failed to create data fetch history record" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

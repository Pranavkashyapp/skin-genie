import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analysisRequestSchema, analysisResultSchema } from "@shared/schema";
import { skinAnalysisService } from "./services/skinAnalysis";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Prefix all routes with /api
  
  // Endpoint to get all skin conditions
  app.get("/api/skin-conditions", async (req: Request, res: Response) => {
    try {
      const conditions = await storage.getAllSkinConditions();
      res.json(conditions);
    } catch (error) {
      console.error("Error fetching skin conditions:", error);
      res.status(500).json({ message: "Failed to fetch skin conditions" });
    }
  });

  // Endpoint to get all treatments
  app.get("/api/treatments", async (req: Request, res: Response) => {
    try {
      const treatments = await storage.getAllTreatments();
      res.json(treatments);
    } catch (error) {
      console.error("Error fetching treatments:", error);
      res.status(500).json({ message: "Failed to fetch treatments" });
    }
  });

  // Endpoint to get treatments for a specific condition
  app.get("/api/conditions/:id/treatments", async (req: Request, res: Response) => {
    try {
      const conditionId = parseInt(req.params.id);
      const treatments = await storage.getTreatmentsForCondition(conditionId);
      res.json(treatments);
    } catch (error) {
      console.error("Error fetching treatments for condition:", error);
      res.status(500).json({ message: "Failed to fetch treatments for condition" });
    }
  });

  // Endpoint for analyzing skin images
  app.post("/api/analyze", async (req: Request, res: Response) => {
    try {
      // Validate request data
      const validatedData = analysisRequestSchema.parse(req.body);
      
      // Process the image and get analysis results
      const analysisResult = await skinAnalysisService.analyzeImage(validatedData.imageData);
      
      // Validate the result against our schema
      const validatedResult = analysisResultSchema.parse(analysisResult);
      
      res.json(validatedResult);
    } catch (error) {
      console.error("Error during image analysis:", error);
      
      // Handle validation errors specially
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          message: "Validation error",
          details: validationError.message
        });
      }
      
      res.status(500).json({ message: "Failed to analyze image" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

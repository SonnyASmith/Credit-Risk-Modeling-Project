import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLoanApplicationSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create API router
  const apiRouter = express.Router();

  // Loan application submission route
  apiRouter.post("/applications", async (req, res) => {
    try {
      // Validate the request body
      const validatedData = insertLoanApplicationSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        const validationError = fromZodError(validatedData.error);
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validationError.details 
        });
      }
      
      // Create the loan application
      const application = await storage.createLoanApplication(validatedData.data);
      
      return res.status(201).json(application);
    } catch (error) {
      console.error("Error creating loan application:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get loan application by ID
  apiRouter.get("/applications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid application ID" });
      }
      
      const application = await storage.getLoanApplication(id);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      return res.json(application);
    } catch (error) {
      console.error("Error fetching loan application:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all loan applications
  apiRouter.get("/applications", async (_req, res) => {
    try {
      const applications = await storage.getAllLoanApplications();
      return res.json(applications);
    } catch (error) {
      console.error("Error fetching loan applications:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Health check endpoint
  apiRouter.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Register all routes with /api prefix
  app.use("/api", apiRouter);

  // Create the HTTP server
  const httpServer = createServer(app);

  return httpServer;
}

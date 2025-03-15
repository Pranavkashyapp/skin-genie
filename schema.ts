import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Skin conditions table
export const skinConditions = pgTable("skin_conditions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  symptoms: text("symptoms").notNull(),
  severity: text("severity").notNull(), // mild, moderate, severe
  commonLocations: text("common_locations").notNull(), // e.g., "cheeks, forehead"
});

export const insertSkinConditionSchema = createInsertSchema(skinConditions).pick({
  name: true,
  description: true,
  symptoms: true,
  severity: true,
  commonLocations: true,
});

export type InsertSkinCondition = z.infer<typeof insertSkinConditionSchema>;
export type SkinCondition = typeof skinConditions.$inferSelect;

// Treatments table
export const treatments = pgTable("treatments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  ingredients: text("ingredients").notNull(),
  recommendationLevel: text("recommendation_level").notNull(), // high, medium, low
  tags: text("tags").notNull(), // comma-separated tags like "oil-free", "prescription needed"
});

export const insertTreatmentSchema = createInsertSchema(treatments).pick({
  name: true,
  description: true,
  ingredients: true,
  recommendationLevel: true,
  tags: true,
});

export type InsertTreatment = z.infer<typeof insertTreatmentSchema>;
export type Treatment = typeof treatments.$inferSelect;

// Condition-Treatment relationship table
export const conditionTreatments = pgTable("condition_treatments", {
  id: serial("id").primaryKey(),
  conditionId: integer("condition_id").notNull(),
  treatmentId: integer("treatment_id").notNull(),
  efficacy: text("efficacy").notNull(), // high, medium, low
});

export const insertConditionTreatmentSchema = createInsertSchema(conditionTreatments).pick({
  conditionId: true,
  treatmentId: true,
  efficacy: true,
});

export type InsertConditionTreatment = z.infer<typeof insertConditionTreatmentSchema>;
export type ConditionTreatment = typeof conditionTreatments.$inferSelect;

// Analysis results schema
export const analysisResultSchema = z.object({
  detectedConditions: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      locations: z.string(),
      confidence: z.number(),
      severity: z.string(),
    })
  ),
  recommendedTreatments: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      recommendationLevel: z.string(),
      tags: z.array(z.string()),
    })
  ),
  imageData: z.string().optional(), // Base64 image data
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;

// Analysis request schema
export const analysisRequestSchema = z.object({
  imageData: z.string(), // Base64 image data
});

export type AnalysisRequest = z.infer<typeof analysisRequestSchema>;

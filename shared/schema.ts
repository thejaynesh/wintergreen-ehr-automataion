import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Healthcare Providers table
export const healthcareProviders = pgTable("healthcare_providers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  groupId: text("group_id").notNull().unique(),
  contactName: text("contact_name"),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  company: text("company"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  country: text("country").default("USA"),
  createdAt: timestamp("created_at").defaultNow(),
});

// EHR Systems table
export const ehrSystems = pgTable("ehr_systems", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID as requested
  systemName: varchar("system_name", { length: 255 }).notNull(), // Unique name as requested
  systemVersion: varchar("system_version", { length: 50 }),
  apiEndpoint: varchar("api_endpoint", { length: 255 }), // Base URL for the EHR API
  dataFormat: varchar("data_format", { length: 50 }),
  authorizationType: varchar("authorization_type", { length: 50 }),
  clientId: varchar("client_id", { length: 255 }),
  clientSecret: varchar("client_secret", { length: 255 }),
  additionalNotes: text("additional_notes"), // Description of the EHR system
  isSupported: boolean("is_supported").default(true), // Whether the EHR is actively supported
  // Keep provider relationship for linking EHR to healthcare providers
  providerId: integer("provider_id").references(() => healthcareProviders.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Data Fetch History table
export const dataFetchHistory = pgTable("data_fetch_history", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").references(() => healthcareProviders.id).notNull(),
  fetchDate: timestamp("fetch_date").defaultNow(),
  s3Location: text("s3_location").notNull(),
  status: text("status").default("completed"),
});

// Relations
export const providerRelations = relations(healthcareProviders, ({ many }) => ({
  ehrSystems: many(ehrSystems),
  fetchHistory: many(dataFetchHistory),
}));

export const ehrSystemRelations = relations(ehrSystems, ({ one }) => ({
  provider: one(healthcareProviders, {
    fields: [ehrSystems.providerId],
    references: [healthcareProviders.id],
  }),
}));

export const dataFetchHistoryRelations = relations(dataFetchHistory, ({ one }) => ({
  provider: one(healthcareProviders, {
    fields: [dataFetchHistory.providerId],
    references: [healthcareProviders.id],
  }),
}));

// Schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertHealthcareProviderSchema = createInsertSchema(healthcareProviders).omit({
  id: true,
  createdAt: true,
});

export const insertEhrSystemSchema = createInsertSchema(ehrSystems).omit({
  id: true,
  createdAt: true,
}).extend({
  // Generate a UUID for the id if not provided
  id: z.string().uuid().optional()
});

export const insertDataFetchHistorySchema = createInsertSchema(dataFetchHistory).omit({
  id: true,
  fetchDate: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertHealthcareProvider = z.infer<typeof insertHealthcareProviderSchema>;
export type HealthcareProvider = typeof healthcareProviders.$inferSelect;

export type InsertEhrSystem = z.infer<typeof insertEhrSystemSchema>;
export type EhrSystem = typeof ehrSystems.$inferSelect;

export type InsertDataFetchHistory = z.infer<typeof insertDataFetchHistorySchema>;
export type DataFetchHistory = typeof dataFetchHistory.$inferSelect;

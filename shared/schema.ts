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

// EHR Systems table
export const ehrSystems = pgTable("ehr_systems", {
  id: varchar("id", { length: 36 }).primaryKey(), // UUID primary key
  systemName: varchar("system_name", { length: 255 }).notNull(), // Unique name for the EHR system
  systemVersion: varchar("system_version", { length: 50 }),
  apiEndpoint: varchar("api_endpoint", { length: 255 }), // Base URL for the EHR API
  documentationLink: varchar("documentation_link", { length: 255 }), // Link to documentation
  authUrl: varchar("auth_url", { length: 255 }), // Authorization URL
  conUrl: varchar("con_url", { length: 255 }), // Connection URL
  bulkfhirUrl: varchar("bulkfhir_url", { length: 255 }), // Bulk FHIR URL
  // dataFormat, clientId, clientSecret removed as requested
  additionalNotes: text("additional_notes"), // Description of the EHR system
  isSupported: boolean("is_supported").default(true), // Whether the EHR is actively supported
  createdAt: timestamp("created_at").defaultNow(),
});

// Healthcare Providers table - updated according to new structure
export const healthcareProviders = pgTable("healthcare_providers", {
  id: varchar("provider_id", { length: 36 }).primaryKey(), // UUID Primary Key
  providerName: varchar("provider_name", { length: 255 }).notNull(), // Name of the healthcare provider organization
  providerType: text("provider_type").notNull(), // Type of healthcare facility
  contactEmail: varchar("contact_email", { length: 255 }).notNull(), // Primary contact email address
  contactPhone: varchar("contact_phone", { length: 20 }).notNull(), // Contact phone number
  address: text("address"), // Physical address of the provider
  ehrId: varchar("ehr_id", { length: 36 }).references(() => ehrSystems.id), // Foreign key to EHR systems table
  ehrTenantId: varchar("ehr_tenant_id", { length: 255 }), // Tenant ID for multi-tenant EHR systems
  ehrGroupId: varchar("ehr_group_id", { length: 255 }), // Group ID of the group data to be fetched from EHR systems
  // secretsManagerArn removed as requested
  onboardedDate: timestamp("onboarded_date").defaultNow(), // Date when provider was onboarded into the system
  lastDataFetch: timestamp("last_data_fetch"), // When provider data was last fetched from EHR
  status: text("status").default("Pending"), // Current status (Active, Inactive, Pending, Error)
  notes: text("notes"), // Additional information about the provider
});

// Data Fetch History table
export const dataFetchHistory = pgTable("data_fetch_history", {
  id: serial("id").primaryKey(),
  providerId: varchar("provider_id", { length: 36 }).references(() => healthcareProviders.id).notNull(),
  fetchDate: timestamp("fetch_date").defaultNow(),
  s3Location: text("s3_location").notNull(),
  status: text("status").default("completed"),
});

// Relations
export const providerRelations = relations(healthcareProviders, ({ one, many }) => ({
  ehrSystem: one(ehrSystems, {
    fields: [healthcareProviders.ehrId],
    references: [ehrSystems.id],
  }),
  fetchHistory: many(dataFetchHistory),
}));

export const ehrSystemRelations = relations(ehrSystems, ({ many }) => ({
  providers: many(healthcareProviders),
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
  onboardedDate: true,
  lastDataFetch: true,
}).extend({
  // Generate a UUID for the id if not provided
  id: z.string().uuid().optional()
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

// Provider type enum for form validation
export const providerTypeEnum = z.enum([
  "Hospital", 
  "Clinic", 
  "Private Practice", 
  "SpecialistCenter", 
  "Other"
]);

// Provider status enum for form validation
export const providerStatusEnum = z.enum([
  "Active", 
  "Inactive", 
  "Pending", 
  "Error"
]);

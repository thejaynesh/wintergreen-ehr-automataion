import { 
  users, 
  healthcareProviders, 
  ehrSystems, 
  dataFetchHistory,
  type User, 
  type InsertUser,
  type HealthcareProvider,
  type InsertHealthcareProvider,
  type EhrSystem,
  type InsertEhrSystem,
  type DataFetchHistory,
  type InsertDataFetchHistory
} from "@shared/schema";
import { db } from "./db";
import { eq, like, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Healthcare Provider methods
  getHealthcareProvider(id: string): Promise<HealthcareProvider | undefined>;
  getHealthcareProviderByEhrId(ehrId: string): Promise<HealthcareProvider[]>;
  getAllHealthcareProviders(): Promise<HealthcareProvider[]>;
  searchHealthcareProviders(searchTerm: string): Promise<HealthcareProvider[]>;
  createHealthcareProvider(provider: InsertHealthcareProvider): Promise<HealthcareProvider>;
  updateHealthcareProvider(id: string, provider: Partial<InsertHealthcareProvider>): Promise<HealthcareProvider | undefined>;
  deleteHealthcareProvider(id: string): Promise<boolean>;

  // EHR System methods
  getEhrSystem(id: string): Promise<EhrSystem | undefined>;
  getAllEhrSystems(): Promise<EhrSystem[]>;
  createEhrSystem(system: InsertEhrSystem): Promise<EhrSystem>;
  updateEhrSystem(id: string, system: Partial<InsertEhrSystem>): Promise<EhrSystem | undefined>;

  // Data Fetch History methods
  getDataFetchHistory(id: number): Promise<DataFetchHistory | undefined>;
  getAllDataFetchHistory(): Promise<DataFetchHistory[]>;
  getDataFetchHistoryByProviderId(providerId: string): Promise<DataFetchHistory[]>;
  searchDataFetchHistory(searchTerm: string): Promise<DataFetchHistory[]>;
  createDataFetchHistory(history: InsertDataFetchHistory): Promise<DataFetchHistory>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Healthcare Provider methods
  async getHealthcareProvider(id: string): Promise<HealthcareProvider | undefined> {
    const [provider] = await db.select().from(healthcareProviders).where(eq(healthcareProviders.id, id));
    return provider;
  }

  async getHealthcareProviderByEhrId(ehrId: string): Promise<HealthcareProvider[]> {
    return db.select().from(healthcareProviders).where(eq(healthcareProviders.ehrId, ehrId));
  }

  async getAllHealthcareProviders(): Promise<HealthcareProvider[]> {
    return db.select().from(healthcareProviders);
  }

  async searchHealthcareProviders(searchTerm: string): Promise<HealthcareProvider[]> {
    return db.select().from(healthcareProviders).where(
      like(healthcareProviders.providerName, `%${searchTerm}%`)
    );
  }

  async createHealthcareProvider(provider: InsertHealthcareProvider): Promise<HealthcareProvider> {
    // Ensure provider has an id
    const providerData = { ...provider };
    
    // If id is undefined, always create a new UUID
    if (!providerData.id) {
      providerData.id = uuidv4();
    }
    
    // Create a new object with only the fields that are defined in the schema
    const insertData = {
      id: providerData.id as string, // Cast to string to resolve TypeScript error
      providerName: providerData.providerName,
      providerType: providerData.providerType,
      contactEmail: providerData.contactEmail,
      contactPhone: providerData.contactPhone,
      address: providerData.address || null,
      ehrId: providerData.ehrId || null,
      ehrTenantId: providerData.ehrTenantId || null,
      ehrGroupId: providerData.ehrGroupId || null,
      // secretsManagerArn removed
      status: providerData.status || 'Pending',
      notes: providerData.notes || null
    };
    
    const [newProvider] = await db
      .insert(healthcareProviders)
      .values(insertData) // Remove the array brackets to fix TypeScript error
      .returning();
    return newProvider;
  }

  async updateHealthcareProvider(id: string, provider: Partial<InsertHealthcareProvider>): Promise<HealthcareProvider | undefined> {
    const [updatedProvider] = await db
      .update(healthcareProviders)
      .set(provider)
      .where(eq(healthcareProviders.id, id))
      .returning();
    return updatedProvider;
  }

  async deleteHealthcareProvider(id: string): Promise<boolean> {
    const result = await db
      .delete(healthcareProviders)
      .where(eq(healthcareProviders.id, id))
      .returning({ id: healthcareProviders.id });
    return result.length > 0;
  }

  // EHR System methods
  async getEhrSystem(id: string): Promise<EhrSystem | undefined> {
    const [system] = await db.select().from(ehrSystems).where(eq(ehrSystems.id, id));
    return system;
  }

  async getAllEhrSystems(): Promise<EhrSystem[]> {
    return db.select().from(ehrSystems);
  }

  async createEhrSystem(system: InsertEhrSystem): Promise<EhrSystem> {
    // Ensure system has an id
    const systemData = { ...system };
    
    // If id is undefined, always create a new UUID
    if (!systemData.id) {
      systemData.id = uuidv4();
    }
    
    // Create a new object with only the fields that are defined in the schema
    const insertData = {
      id: systemData.id as string, // Cast to string to resolve TypeScript error
      systemName: systemData.systemName,
      systemVersion: systemData.systemVersion || null,
      apiEndpoint: systemData.apiEndpoint || null,
      documentationLink: systemData.documentationLink || null,
      authUrl: systemData.authUrl || null,
      conUrl: systemData.conUrl || null,
      bulkfhirUrl: systemData.bulkfhirUrl || null,
      additionalNotes: systemData.additionalNotes || null,
      isSupported: systemData.isSupported !== undefined ? systemData.isSupported : true
    };
    
    const [newSystem] = await db
      .insert(ehrSystems)
      .values(insertData) // Remove the array brackets to fix TypeScript error
      .returning();
    return newSystem;
  }

  async updateEhrSystem(id: string, system: Partial<InsertEhrSystem>): Promise<EhrSystem | undefined> {
    const [updatedSystem] = await db
      .update(ehrSystems)
      .set(system)
      .where(eq(ehrSystems.id, id))
      .returning();
    return updatedSystem;
  }

  // Data Fetch History methods
  async getDataFetchHistory(id: number): Promise<DataFetchHistory | undefined> {
    const [history] = await db.select().from(dataFetchHistory).where(eq(dataFetchHistory.id, id));
    return history;
  }

  async getAllDataFetchHistory(): Promise<DataFetchHistory[]> {
    return db.select().from(dataFetchHistory).orderBy(desc(dataFetchHistory.fetchDate));
  }

  async getDataFetchHistoryByProviderId(providerId: string): Promise<DataFetchHistory[]> {
    return db
      .select()
      .from(dataFetchHistory)
      .where(eq(dataFetchHistory.providerId, providerId))
      .orderBy(desc(dataFetchHistory.fetchDate));
  }

  async searchDataFetchHistory(searchTerm: string): Promise<DataFetchHistory[]> {
    const results = await db
      .select({
        history: dataFetchHistory,
        providerName: healthcareProviders.providerName
      })
      .from(dataFetchHistory)
      .innerJoin(
        healthcareProviders,
        eq(dataFetchHistory.providerId, healthcareProviders.id)
      )
      .where(
        like(healthcareProviders.providerName, `%${searchTerm}%`)
      )
      .orderBy(desc(dataFetchHistory.fetchDate));
    
    return results.map(r => r.history);
  }

  async createDataFetchHistory(history: InsertDataFetchHistory): Promise<DataFetchHistory> {
    const [newHistory] = await db
      .insert(dataFetchHistory)
      .values(history)
      .returning();
    return newHistory;
  }
}

export const storage = new DatabaseStorage();

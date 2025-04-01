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

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Healthcare Provider methods
  getHealthcareProvider(id: number): Promise<HealthcareProvider | undefined>;
  getHealthcareProviderByGroupId(groupId: string): Promise<HealthcareProvider | undefined>;
  getAllHealthcareProviders(): Promise<HealthcareProvider[]>;
  searchHealthcareProviders(searchTerm: string): Promise<HealthcareProvider[]>;
  createHealthcareProvider(provider: InsertHealthcareProvider): Promise<HealthcareProvider>;
  updateHealthcareProvider(id: number, provider: Partial<InsertHealthcareProvider>): Promise<HealthcareProvider | undefined>;
  deleteHealthcareProvider(id: number): Promise<boolean>;

  // EHR System methods
  getEhrSystem(id: number): Promise<EhrSystem | undefined>;
  getEhrSystemByProviderId(providerId: number): Promise<EhrSystem | undefined>;
  getAllEhrSystems(): Promise<EhrSystem[]>;
  createEhrSystem(system: InsertEhrSystem): Promise<EhrSystem>;
  updateEhrSystem(id: number, system: Partial<InsertEhrSystem>): Promise<EhrSystem | undefined>;

  // Data Fetch History methods
  getDataFetchHistory(id: number): Promise<DataFetchHistory | undefined>;
  getAllDataFetchHistory(): Promise<DataFetchHistory[]>;
  getDataFetchHistoryByProviderId(providerId: number): Promise<DataFetchHistory[]>;
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
  async getHealthcareProvider(id: number): Promise<HealthcareProvider | undefined> {
    const [provider] = await db.select().from(healthcareProviders).where(eq(healthcareProviders.id, id));
    return provider;
  }

  async getHealthcareProviderByGroupId(groupId: string): Promise<HealthcareProvider | undefined> {
    const [provider] = await db.select().from(healthcareProviders).where(eq(healthcareProviders.groupId, groupId));
    return provider;
  }

  async getAllHealthcareProviders(): Promise<HealthcareProvider[]> {
    return db.select().from(healthcareProviders);
  }

  async searchHealthcareProviders(searchTerm: string): Promise<HealthcareProvider[]> {
    return db.select().from(healthcareProviders).where(
      like(healthcareProviders.name, `%${searchTerm}%`)
    );
  }

  async createHealthcareProvider(provider: InsertHealthcareProvider): Promise<HealthcareProvider> {
    const [newProvider] = await db
      .insert(healthcareProviders)
      .values(provider)
      .returning();
    return newProvider;
  }

  async updateHealthcareProvider(id: number, provider: Partial<InsertHealthcareProvider>): Promise<HealthcareProvider | undefined> {
    const [updatedProvider] = await db
      .update(healthcareProviders)
      .set(provider)
      .where(eq(healthcareProviders.id, id))
      .returning();
    return updatedProvider;
  }

  async deleteHealthcareProvider(id: number): Promise<boolean> {
    const result = await db
      .delete(healthcareProviders)
      .where(eq(healthcareProviders.id, id))
      .returning({ id: healthcareProviders.id });
    return result.length > 0;
  }

  // EHR System methods
  async getEhrSystem(id: number): Promise<EhrSystem | undefined> {
    const [system] = await db.select().from(ehrSystems).where(eq(ehrSystems.id, id));
    return system;
  }

  async getEhrSystemByProviderId(providerId: number): Promise<EhrSystem | undefined> {
    const [system] = await db.select().from(ehrSystems).where(eq(ehrSystems.providerId, providerId));
    return system;
  }

  async getAllEhrSystems(): Promise<EhrSystem[]> {
    return db.select().from(ehrSystems);
  }

  async createEhrSystem(system: InsertEhrSystem): Promise<EhrSystem> {
    const [newSystem] = await db
      .insert(ehrSystems)
      .values(system)
      .returning();
    return newSystem;
  }

  async updateEhrSystem(id: number, system: Partial<InsertEhrSystem>): Promise<EhrSystem | undefined> {
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

  async getDataFetchHistoryByProviderId(providerId: number): Promise<DataFetchHistory[]> {
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
        providerName: healthcareProviders.name,
        groupId: healthcareProviders.groupId
      })
      .from(dataFetchHistory)
      .innerJoin(
        healthcareProviders,
        eq(dataFetchHistory.providerId, healthcareProviders.id)
      )
      .where(
        like(healthcareProviders.name, `%${searchTerm}%`)
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

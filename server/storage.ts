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
// import { db } from "./db";
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
  // // Healthcare Provider methods
  // async getHealthcareProvider(id: string): Promise<HealthcareProvider | undefined> {
  //   const [provider] = await db.select().from(healthcareProviders).where(eq(healthcareProviders.id, id));
  //   console.log("getHealthcareProvider called:", provider);
  //   return provider;
  // }


  async getAllHealthcareProviders(): Promise<HealthcareProvider[]> {
    const result = [
      {
        id: 'fccbcb8a-cfad-4f0c-adc2-1a4e9b875ac0',
        providerName: 'Karleigh Mcdaniel',
        providerType: 'Hospital',
        contactEmail: 'jydutax@mailinator.com',
        contactPhone: '23232677702',
        address: 'Sed nihil at et quib',
        ehrId: 'cfe3b734-f8aa-4cf4-aea9-3eac657a8d53',
        ehrTenantId: 'Ad quisquam enim qui',
        ehrGroupId: 'Voluptatum animi qu',
        onboardedDate: '2025-04-04T14:22:29.395Z',
        lastDataFetch: null,
        status: 'Active',
        notes: 'Dolores ad sint omni'
      },
    ];
    console.log("getAllHealthcareProviders called:", result);
    return result;
  }

  async createHealthcareProvider(provider: InsertHealthcareProvider): Promise<HealthcareProvider> {
    // Ensure provider has an id
    const providerData = { ...provider };
    if (!providerData.id) {
      providerData.id = uuidv4();
    }
    const insertData = {
      id: providerData.id as string,
      providerName: providerData.providerName,
      providerType: providerData.providerType,
      contactEmail: providerData.contactEmail,
      contactPhone: providerData.contactPhone,
      address: providerData.address || null,
      ehrId: providerData.ehrId || null,
      ehrTenantId: providerData.ehrTenantId || null,
      ehrGroupId: providerData.ehrGroupId || null,
      status: providerData.status || 'Pending',
      notes: providerData.notes || null
    };
    
    const newProvider = {
      id: '4670a9aa-a882-4809-8f2b-65073ffa54cf',
      providerName: 'qqqqqqqqqqqqqqq',
      providerType: 'Hospital',
      contactEmail: 'dw@gmail.com',
      contactPhone: '11111222222',
      address: 'dwadwad wad',
      ehrId: 'cfe3b734-f8aa-4cf4-aea9-3eac657a8d53',
      ehrTenantId: 'dwdaaassd',
      ehrGroupId: 'dwasdwawdw',
      onboardedDate: '2025-04-12T23:49:21.136Z',
      lastDataFetch: null,
      status: 'Pending',
      notes: 'dwadsad'
    }
    // console.log("createHealthcareProvider called:", newProvider);
    return newProvider;
  }

  // async updateHealthcareProvider(id: string, provider: Partial<InsertHealthcareProvider>): Promise<HealthcareProvider | undefined> {
  //   // code to update provider
  //   const [updatedProvider] = await db
  //     .update(healthcareProviders)
  //     .set(provider)
  //     .where(eq(healthcareProviders.id, id))
  //     .returning();
  //   console.log("updateHealthcareProvider called:", updatedProvider);
  //   return updatedProvider;
  // }

  async deleteHealthcareProvider(id: string): Promise<boolean> {
    // code to delete providor
    // const result = await db
    //   .delete(healthcareProviders)
    //   .where(eq(healthcareProviders.id, id))
    //   .returning({ id: healthcareProviders.id });
    // console.log("deleteHealthcareProvider called:", result);

    return true;
  }

  // EHR System methods
  // async getEhrSystem(id: string): Promise<EhrSystem | undefined> {
  //   const [system] = await db.select().from(ehrSystems).where(eq(ehrSystems.id, id));
  //   console.log("getEhrSystem called:", system);
  //   return system;
  // }

  async getAllEhrSystems(): Promise<EhrSystem[]> {
    const result = [
      {
        id: 'cfe3b734-f8aa-4cf4-aea9-3eac657a8d53',
        systemName: 'wdawdawweeeeeeeeeeeeeeeeee',
        systemVersion: null,
        apiEndpoint: 'https://dowm/v1/',
        documentationLink: 'https://dowm/v1/',
        authUrl: 'https://dowm/v1/',
        conUrl: 'https://dowm/v1/',
        bulkfhirUrl: 'https://dowm/v1/',
        additionalNotes: 'shttps://dowm/v1/',
        isSupported: true,
        createdAt: '2025-04-04T14:21:58.970Z'
      }
    ];
    console.log("getAllEhrSystems called:", result);
    return result;
  }

  async createEhrSystem(system: InsertEhrSystem): Promise<EhrSystem> {
    const systemData = { ...system };
    if (!systemData.id) {
      systemData.id = uuidv4();
    }
    const insertData = {
      id: systemData.id as string,
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
    
    // const [newSystem] = await db
    //   .insert(ehrSystems)
    //   .values(insertData)
    //   .returning();
    const newSystem = {
      id: 'd2f78678-9261-4cef-b790-a080bbb3d9f3',
      systemName: 'Hyacinth Dale',
      systemVersion: null,
      apiEndpoint: 'https://chatgpt.com/c/67fb2045-5cf0-800d-85bf-2fcc0d782e0e',
      documentationLink: 'https://chatgpt.com/c/67fb2045-5cf0-800d-85bf-2fcc0d782e0e',
      authUrl: 'https://chatgpt.com/c/67fb2045-5cf0-800d-85bf-2fcc0d782e0e',
      conUrl: 'https://chatgpt.com/c/67fb2045-5cf0-800d-85bf-2fcc0d782e0e',
      bulkfhirUrl: 'https://chatgpt.com/c/67fb2045-5cf0-800d-85bf-2fcc0d782e0e',
      additionalNotes: 'https://chatgpt.com/c/67fb2045-5cf0-800d-85bf-2fcc0d782e0e',
      isSupported: true,
      createdAt: '2025-04-13T00:01:12.482Z'
    };
    console.log("createEhrSystem called:", newSystem);
    return newSystem;
  }

  // async updateEhrSystem(id: string, system: Partial<InsertEhrSystem>): Promise<EhrSystem | undefined> {
  //   const [updatedSystem] = await db
  //     .update(ehrSystems)
  //     .set(system)
  //     .where(eq(ehrSystems.id, id))
  //     .returning();
  //   console.log("updateEhrSystem called:", updatedSystem);
  //   return updatedSystem;
  // }

  // Data Fetch History methods
  // async getDataFetchHistory(id: number): Promise<DataFetchHistory | undefined> {
  //   const [history] = await db.select().from(dataFetchHistory).where(eq(dataFetchHistory.id, id));
  //   console.log("getDataFetchHistory called:", history);
  //   return history;
  // }

  async getAllDataFetchHistory(): Promise<DataFetchHistory[]> {
    const result = [];
    console.log("getAllDataFetchHistory called:", result);
    return result;
  }

  // async getDataFetchHistoryByProviderId(providerId: string): Promise<DataFetchHistory[]> {
  //   const result = await db
  //     .select()
  //     .from(dataFetchHistory)
  //     .where(eq(dataFetchHistory.providerId, providerId))
  //     .orderBy(desc(dataFetchHistory.fetchDate));
  //   console.log("getDataFetchHistoryByProviderId called:", result);
  //   return result;
  // }

  // async searchDataFetchHistory(searchTerm: string): Promise<DataFetchHistory[]> {
  //   const results = await db
  //     .select({
  //       history: dataFetchHistory,
  //       providerName: healthcareProviders.providerName
  //     })
  //     .from(dataFetchHistory)
  //     .innerJoin(
  //       healthcareProviders,
  //       eq(dataFetchHistory.providerId, healthcareProviders.id)
  //     )
  //     .where(
  //       like(healthcareProviders.providerName, `%${searchTerm}%`)
  //     )
  //     .orderBy(desc(dataFetchHistory.fetchDate));
    
  //   const histories = results.map(r => r.history);
  //   console.log("searchDataFetchHistory called:", histories);
  //   return histories;
  // }

  async createDataFetchHistory(history: InsertDataFetchHistory): Promise<DataFetchHistory> {
    // const [newHistory] = await db
    //   .insert(dataFetchHistory)
    //   .values(history)
    //   .returning();
    const newHistory = 1;
    console.log("createDataFetchHistory called:", newHistory);
    return newHistory;
  }
}

export const storage = new DatabaseStorage();

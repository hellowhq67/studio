import { betterAuth, createAdapter } from "better-auth";

const memoryDB = {
    user: [],
    session: [],
    authenticator: [],
};

// A minimal, do-nothing adapter to satisfy better-auth during build.
const memoryAdapter = () => createAdapter({
    config: {
        adapterId: "memory",
        adapterName: "In-memory Adapter",
        supportsDates: true,
        supportsJSON: true,
        supportsBooleans: true,
        supportsNumericIds: false,
    },
    adapter: () => {
        return {
            create: async ({ model, data }: any) => {
                const db = (memoryDB as any)[model];
                if (!db) throw new Error(`Model ${model} not found`);
                const newData = { ...data, id: crypto.randomUUID() };
                db.push(newData);
                return newData;
            },
            update: async ({ model, where, data }: any) => {
                 const db = (memoryDB as any)[model];
                 if (!db) throw new Error(`Model ${model} not found`);
                 // This is a simplified implementation for build purposes
                 return {} as any;
            },
            delete: async ({ model, where }: any) => {
                // This is a simplified implementation for build purposes
            },
            findOne: async ({ model, where }: any) => {
                const db = (memoryDB as any)[model] as any[];
                if (!db) return null;
                const key = Object.keys(where)[0];
                const value = Object.values(where)[0];
                return db.find(item => item[key] === value) || null;
            },
            findMany: async ({ model, where }: any) => {
                const db = (memoryDB as any)[model] as any[];
                if (!db) return [];
                if (!where || Object.keys(where).length === 0) return db;
                
                const key = Object.keys(where)[0];
                const value = Object.values(where)[0];
                return db.filter(item => item[key] === value);
            }
        };
    },
});

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },
    database: memoryAdapter(),
});

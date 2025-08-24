import { betterAuth } from "better-auth";
import { sqliteAdapter } from "better-auth/adapters/sqlite";
import Database from "better-sqlite3";

const db = new Database(":memory:");

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },
    database: sqliteAdapter({
        db,
    }),
});

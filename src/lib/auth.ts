import { betterAuth } from "better-auth";
// The drizzleAdapter import is removed as it's causing build issues.
// We will re-evaluate the database integration for auth later.

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },
    // The database adapter configuration is temporarily removed.
    // database: drizzleAdapter(db, {
    //   provider: "pg",
    //   schema,
    // }),
});

import { betterAuth } from "better-auth";

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },
    // database: new Database("./sqlite.db"), // Removed to prevent build errors on Vercel
});

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const server = createEnv({
    server: {
        NODE_ENV: z.string().min(1),
        CLERK_SECRET_KEY: z.string().min(1),
        CLERK_WEBHOOK_SIGNING_SECRET: z.string().min(1),
        ENCRYPTION_KEY: z.string().min(1),
        DATABASE_URL: z.string().url(),
    },

    experimental__runtimeEnv: process.env
});
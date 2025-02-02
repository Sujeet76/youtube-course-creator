import { defineConfig } from "drizzle-kit";

import { env } from "@/env/server";

export default defineConfig({
  out: "./src/drizzle/migrations",
  schema: "./src/drizzle/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/env/server";

import * as schema from "./schema";

const conn = postgres(env.DATABASE_URL, {
  prepare: false,
});

export const db = drizzle({ client: conn, schema });

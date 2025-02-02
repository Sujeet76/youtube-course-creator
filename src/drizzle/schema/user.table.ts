import { boolean, pgTable, text } from "drizzle-orm/pg-core";

import { createdAt, id, updatedAt } from "../schema.helper";

export const user = pgTable("user", {
  id,
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt,
  updatedAt,
});

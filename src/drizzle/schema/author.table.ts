import { relations } from "drizzle-orm";
import { index, integer, pgTable, text } from "drizzle-orm/pg-core";

import { createdAt, id, updatedAt } from "../schema.helper";
import { courses } from "./courses.table";

export const author = pgTable(
  "authors",
  {
    id,
    name: text("name").notNull(),
    imgUrl: text("img_url").notNull(),
    bio: text("bio").notNull(),
    subscriberCount: integer("subscriber_count").notNull().default(0),
    youtubeChannelId: text("youtube_channel_id").unique(),
    youtubeChannelUrl: text("youtube_channel_url"),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("name_index").on(table.name),
    index("subscriber_count_idx").on(table.subscriberCount),
  ]
);

export const authorRelations = relations(author, ({ many }) => ({
  courses: many(courses),
}));

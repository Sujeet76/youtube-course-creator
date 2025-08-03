import { decimal, index, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { createdAt, id, updatedAt } from "../schema.helper";
import { users } from "./user.table";
import { videos } from "./videos.table";

export const notes = pgTable(
  "notes",
  {
    id,
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    videoId: uuid("video_id")
      .notNull()
      .references(() => videos.id, {
        onDelete: "cascade",
      }),
    content: text("content").notNull(),
    timestamp: decimal("timestamp"), // timestamp in video where note was taken
    createdAt,
    updatedAt,
  },
  (table) => [
    index("notes_user_id_idx").on(table.userId),
    index("notes_video_id_idx").on(table.videoId),
  ]
);

import {
  AnyPgColumn,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { id } from "../schema.helper";
import { users } from "./user.table";
import { videos } from "./videos.table";

export const comments = pgTable(
  "comments",
  {
    id,
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    videoId: uuid("video_id").references(() => videos.id, {
      onDelete: "cascade",
    }),
    content: text("content").notNull(),
    parentCommentId: uuid("parent_comment_id").references(
      (): AnyPgColumn => comments.id,
      {
        onDelete: "set null",
      }
    ),
    likes: integer("likes").default(0),
    isPinned: integer("is_pinned").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("comments_video_id_idx").on(table.videoId),
    index("parent_comment_idx").on(table.parentCommentId),
  ]
);

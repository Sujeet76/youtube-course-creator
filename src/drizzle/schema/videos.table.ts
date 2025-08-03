import { index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { createdAt, id, updatedAt } from "../schema.helper";
import { courses } from "./courses.table";

export const videos = pgTable(
  "videos",
  {
    id,
    title: text("title").notNull(),
    description: text("description").notNull(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, {
        onDelete: "cascade",
      }),
    youtube_video_id: text("youtube_video_id").notNull(),
    sequenceNumber: integer("sequence_number").notNull(),
    duration: integer("duration"), // in seconds
    thumbnail: text("thumbnail"),
    resource: text("resource").array(),
    publishedAt: text("published_at").notNull(),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("video_course_id_index").on(table.courseId),
    index("sequence_number_index").on(table.sequenceNumber),
    index("youtube_video_id_index").on(table.youtube_video_id),
  ]
);

export type VideoInsertType = typeof videos.$inferInsert;
export type VideoType = typeof videos.$inferSelect;

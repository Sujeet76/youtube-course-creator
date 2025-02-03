import { relations } from "drizzle-orm";
import { index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { createdAt, id, updatedAt } from "../schema.helper";
import { comments } from "./comments.table";
import { courses } from "./courses.table";
import { notes } from "./notes.table";
import { videoProgress } from "./video-progress";

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
    youtube_video_id: text("youtube_video_id").notNull().unique(),
    sequenceNumber: integer("sequence_number").notNull(),
    duration: integer("duration").notNull(), // in seconds
    thumbnail: text("thumbnail"),
    resource: text("resource").array(),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("course_id_index").on(table.courseId),
    index("sequence_number_index").on(table.sequenceNumber),
  ]
);

export const videosRelations = relations(videos, ({ one, many }) => ({
  course: one(courses, {
    fields: [videos.courseId],
    references: [courses.id],
  }),
  progress: many(videoProgress),
  notes: many(notes),
  comments: many(comments),
}));

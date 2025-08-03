import { InferInsertModel } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { createdAt, id, updatedAt } from "../schema.helper";
import { author } from "./author.table";
import { users } from "./user.table";

export const courses = pgTable(
  "courses",
  {
    id,
    title: text("title").notNull(),
    description: text("description"),
    youtubePlaylistId: text("youtube_playlist_id").notNull().unique().notNull(),
    avgRatings: integer("avg_ratings"),
    thumbnail: text("thumbnail"),
    authorId: uuid("author_id")
      .notNull()
      .references(() => author.id, {
        onDelete: "set null",
      }),
    creator: uuid("creator")
      .notNull()
      .references(() => users.id, {
        onDelete: "set null",
      }),
    isPublic: boolean("is_public").notNull().default(false),
    enrolledStudentCount: integer("enrolled_student_count")
      .notNull()
      .default(0),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("course_author_id_idx").on(table.authorId),
    index("creator_id_idx").on(table.creator),
    uniqueIndex("youtube_playlist_id_unique").on(table.youtubePlaylistId),
  ]
);

export type CourseInsertionType = InferInsertModel<typeof courses>;

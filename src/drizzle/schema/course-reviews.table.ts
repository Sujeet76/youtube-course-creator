import {
  index,
  integer,
  pgTable,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { createdAt, id, updatedAt } from "../schema.helper";
import { courses } from "./courses.table";
import { users } from "./user.table";

export const courseReviews = pgTable(
  "course_reviews",
  {
    id,
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, {
        onDelete: "cascade",
      }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    rating: integer("rating").notNull(),
    review: integer("review"),
    createdAt,
    updatedAt,
  },
  (table) => [
    uniqueIndex("course_user_idx").on(table.courseId, table.userId),
    index("rating_idx").on(table.rating),
  ]
);

import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { createdAt, id, updatedAt } from "../schema.helper";
import { courses } from "./courses.table";
import { users } from "./user.table";

export const enrollments = pgTable(
  "enrollments",
  {
    id,
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, {
        onDelete: "cascade",
      }),
    lastAccessedAt: timestamp("last_accessed_at"),
    progress: integer("progress").default(0), // overall progress in
    completedAt: timestamp("completed_at"),
    enrolledAt: timestamp("enrolled_at").notNull().defaultNow(),
    createdAt,
    updatedAt,
  },
  (table) => [
    index("completed_at_index").on(table.completedAt),
    uniqueIndex("user_course_idx").on(table.userId, table.courseId),
  ]
);

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(users, {
    fields: [enrollments.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}));

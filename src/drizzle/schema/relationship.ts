import { relations } from "drizzle-orm";

import { author } from "./author.table";
import { comments } from "./comments.table";
import { courseReviews } from "./course-reviews.table";
import { courseSection } from "./course-section.table";
import { courses } from "./courses.table";
import { enrollments } from "./enrollments.table";
import { notes } from "./notes.table";
import { users } from "./user.table";
import { videoProgress } from "./video-progress";
import { videos } from "./videos.table";

export const authorRelations = relations(author, ({ many }) => ({
  courses: many(courses),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  video: one(videos, {
    fields: [comments.videoId],
    references: [videos.id],
  }),
  userId: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  parent: one(comments, {
    // Relation to parent comment
    fields: [comments.parentCommentId],
    references: [comments.id],
    relationName: "commentReplies",
  }),
  replies: many(comments, {
    // Relation to child comments
    relationName: "commentReplies",
  }),
}));

export const courseReviewRelations = relations(courseReviews, ({ one }) => ({
  course: one(courses, {
    fields: [courseReviews.courseId],
    references: [courses.id],
  }),
  user: one(users, {
    fields: [courseReviews.userId],
    references: [users.id],
  }),
}));

export const courseSectionRelations = relations(
  courseSection,
  ({ one, many }) => ({
    course: one(courses, {
      fields: [courseSection.courseId],
      references: [courses.id],
    }),
    videos: many(videos),
  })
);

export const courseRelations = relations(courses, ({ many, one }) => ({
  author: one(author, {
    fields: [courses.authorId],
    references: [author.id],
  }),
  creator: one(users, {
    fields: [courses.creator],
    references: [users.id],
  }),
  videos: many(videos),
  enrollments: many(enrollments),
  reviews: many(courseReviews),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(users, {
    fields: [enrollments.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
  lastAccessedVideo: one(videos, {
    fields: [enrollments.lastAccessedVideoId],
    references: [videos.id],
  }),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
  video: one(videos, {
    fields: [notes.videoId],
    references: [videos.id],
  }),
}));

export const userRelation = relations(users, ({ many }) => ({
  enrollments: many(enrollments),
  creator: many(courses),
  videoProgress: many(videoProgress),
  notes: many(notes),
  comments: many(comments),
  courseReviews: many(courseReviews),
}));

export const videoProgressRelations = relations(videoProgress, ({ one }) => ({
  user: one(users, {
    fields: [videoProgress.userId],
    references: [users.id],
  }),
  video: one(videos, {
    fields: [videoProgress.videoId],
    references: [videos.id],
  }),
}));

export const videosRelations = relations(videos, ({ one, many }) => ({
  course: one(courses, {
    fields: [videos.courseId],
    references: [courses.id],
  }),
  progress: many(videoProgress),
  notes: many(notes),
  comments: many(comments),
}));

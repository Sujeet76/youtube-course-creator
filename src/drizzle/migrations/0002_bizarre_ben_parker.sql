DROP INDEX "name_index";--> statement-breakpoint
DROP INDEX "author_id_idx";--> statement-breakpoint
DROP INDEX "user_course_idx";--> statement-breakpoint
DROP INDEX "user_video_unique";--> statement-breakpoint
DROP INDEX "course_id_index";--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "account_id_idx" ON "account" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "youtube_channel_id_idx" ON "authors" USING btree ("youtube_channel_id");--> statement-breakpoint
CREATE INDEX "course_author_id_idx" ON "courses" USING btree ("author_id");--> statement-breakpoint
CREATE UNIQUE INDEX "enrollment_course_idx" ON "enrollments" USING btree ("user_id","course_id");--> statement-breakpoint
CREATE INDEX "enrollment_user_id_idx" ON "enrollments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "video_progress_user_video_unique" ON "video_progress" USING btree ("user_id","video_id");--> statement-breakpoint
CREATE INDEX "video_course_id_index" ON "videos" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "youtube_video_id_index" ON "videos" USING btree ("youtube_video_id");
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_last_accessed_video_id_courses_id_fk";
--> statement-breakpoint
ALTER TABLE "enrollments" ALTER COLUMN "last_accessed_video_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_last_accessed_video_id_videos_id_fk" FOREIGN KEY ("last_accessed_video_id") REFERENCES "public"."videos"("id") ON DELETE no action ON UPDATE no action;
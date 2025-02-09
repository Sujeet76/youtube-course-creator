ALTER TABLE "video_progress" ALTER COLUMN "is_completed" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "video_progress" ALTER COLUMN "is_rewatching" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "video_progress" ADD COLUMN "video_length" integer NOT NULL;
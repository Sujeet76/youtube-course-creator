ALTER TABLE "videos" DROP CONSTRAINT "videos_youtube_video_id_unique";--> statement-breakpoint
ALTER TABLE "authors" ALTER COLUMN "youtube_channel_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "videos" ALTER COLUMN "duration" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "published_at" text NOT NULL;
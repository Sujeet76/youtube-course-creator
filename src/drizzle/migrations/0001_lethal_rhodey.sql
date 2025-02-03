ALTER TABLE "courses" ALTER COLUMN "avg_ratings" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "avg_ratings" DROP NOT NULL;
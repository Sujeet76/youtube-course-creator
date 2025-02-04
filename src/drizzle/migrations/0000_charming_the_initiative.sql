CREATE TABLE "account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "authors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"img_url" text NOT NULL,
	"bio" text NOT NULL,
	"subscriber_count" integer DEFAULT 0 NOT NULL,
	"youtube_channel_id" text,
	"youtube_channel_url" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "authors_youtube_channel_id_unique" UNIQUE("youtube_channel_id")
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"video_id" uuid,
	"content" text NOT NULL,
	"parent_comment_id" uuid,
	"likes" integer DEFAULT 0,
	"is_pinned" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "course_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"review" integer,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"youtube_playlist_id" text NOT NULL,
	"avg_ratings" integer,
	"thumbnail" text,
	"author_id" uuid NOT NULL,
	"creator" uuid NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"enrolled_student_count" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "courses_youtube_playlist_id_unique" UNIQUE("youtube_playlist_id")
);
--> statement-breakpoint
CREATE TABLE "enrollments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"last_accessed_at" timestamp,
	"progress" integer DEFAULT 0,
	"completed_at" timestamp,
	"enrolled_at" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"video_id" uuid NOT NULL,
	"content" text NOT NULL,
	"timestamp" integer,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" uuid NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "video_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"video_id" uuid NOT NULL,
	"watched_duration" integer DEFAULT 0,
	"is_completed" boolean DEFAULT false,
	"last_watched_at" timestamp DEFAULT now(),
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "videos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"course_id" uuid NOT NULL,
	"youtube_video_id" text NOT NULL,
	"sequence_number" integer NOT NULL,
	"duration" integer NOT NULL,
	"thumbnail" text,
	"resource" text[],
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "videos_youtube_video_id_unique" UNIQUE("youtube_video_id")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_comment_id_comments_id_fk" FOREIGN KEY ("parent_comment_id") REFERENCES "public"."comments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_reviews" ADD CONSTRAINT "course_reviews_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_reviews" ADD CONSTRAINT "course_reviews_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_creator_user_id_fk" FOREIGN KEY ("creator") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_progress" ADD CONSTRAINT "video_progress_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_progress" ADD CONSTRAINT "video_progress_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "name_index" ON "authors" USING btree ("name");--> statement-breakpoint
CREATE INDEX "subscriber_count_idx" ON "authors" USING btree ("subscriber_count");--> statement-breakpoint
CREATE INDEX "comments_video_id_idx" ON "comments" USING btree ("video_id");--> statement-breakpoint
CREATE INDEX "parent_comment_idx" ON "comments" USING btree ("parent_comment_id");--> statement-breakpoint
CREATE UNIQUE INDEX "course_user_idx" ON "course_reviews" USING btree ("course_id","user_id");--> statement-breakpoint
CREATE INDEX "rating_idx" ON "course_reviews" USING btree ("rating");--> statement-breakpoint
CREATE INDEX "author_id_idx" ON "courses" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "creator_id_idx" ON "courses" USING btree ("creator");--> statement-breakpoint
CREATE UNIQUE INDEX "youtube_playlist_id_unique" ON "courses" USING btree ("youtube_playlist_id");--> statement-breakpoint
CREATE INDEX "completed_at_index" ON "enrollments" USING btree ("completed_at");--> statement-breakpoint
CREATE UNIQUE INDEX "user_course_idx" ON "enrollments" USING btree ("user_id","course_id");--> statement-breakpoint
CREATE INDEX "notes_user_id_idx" ON "notes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notes_video_id_idx" ON "notes" USING btree ("video_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_video_unique" ON "video_progress" USING btree ("user_id","video_id");--> statement-breakpoint
CREATE INDEX "course_id_index" ON "videos" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "sequence_number_index" ON "videos" USING btree ("sequence_number");
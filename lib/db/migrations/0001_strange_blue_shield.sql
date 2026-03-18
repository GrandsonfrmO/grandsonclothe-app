CREATE TYPE "public"."user_role" AS ENUM('admin', 'buyer', 'guest');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_role" DEFAULT 'buyer' NOT NULL;
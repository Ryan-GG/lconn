CREATE TYPE "public"."ldraw_part_type" AS ENUM('part', 'subpart', 'primitive');--> statement-breakpoint
CREATE TABLE "ldraw_parts" (
	"filename" varchar(255) PRIMARY KEY NOT NULL,
	"description" varchar(500) NOT NULL,
	"part_type" "ldraw_part_type" NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "ldraw_parts_part_type_idx" ON "ldraw_parts" USING btree ("part_type");
CREATE TABLE "ldraw_part_geometries" (
	"filename" varchar(255) PRIMARY KEY NOT NULL,
	"subfile_refs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"lines" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"triangles" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"quads" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ldraw_subfile_refs" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_filename" varchar(255) NOT NULL,
	"child_filename" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ldraw_part_geometries" ADD CONSTRAINT "ldraw_part_geometries_filename_ldraw_parts_filename_fk" FOREIGN KEY ("filename") REFERENCES "public"."ldraw_parts"("filename") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ldraw_subfile_refs" ADD CONSTRAINT "ldraw_subfile_refs_parent_filename_ldraw_parts_filename_fk" FOREIGN KEY ("parent_filename") REFERENCES "public"."ldraw_parts"("filename") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ldraw_subfile_refs_parent_idx" ON "ldraw_subfile_refs" USING btree ("parent_filename");--> statement-breakpoint
CREATE INDEX "ldraw_subfile_refs_child_idx" ON "ldraw_subfile_refs" USING btree ("child_filename");
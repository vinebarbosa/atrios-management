CREATE TABLE "card" (
	"id" text PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"seq" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'todo' NOT NULL,
	"repo_id" text,
	"pr_number" integer,
	"pr_url" text,
	"auto" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"long_description" text,
	"stage" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "product_repo" (
	"id" text PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"label" text NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_stage_event" (
	"id" text PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"stage" integer NOT NULL,
	"entered_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "card" ADD CONSTRAINT "card_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card" ADD CONSTRAINT "card_repo_id_product_repo_id_fk" FOREIGN KEY ("repo_id") REFERENCES "public"."product_repo"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_repo" ADD CONSTRAINT "product_repo_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_stage_event" ADD CONSTRAINT "product_stage_event_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "card_productId_seq_uq" ON "card" USING btree ("product_id","seq");--> statement-breakpoint
CREATE INDEX "card_productId_status_idx" ON "card" USING btree ("product_id","status");--> statement-breakpoint
CREATE INDEX "product_repo_productId_idx" ON "product_repo" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "product_stage_event_productId_idx" ON "product_stage_event" USING btree ("product_id");
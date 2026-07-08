CREATE TABLE "access" (
	"id" text PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"name" text NOT NULL,
	"tipo" text NOT NULL,
	"ambiente" text NOT NULL,
	"login" text NOT NULL,
	"password_enc" text NOT NULL,
	"totp_codes_enc" text,
	"notes" text,
	"created_by_id" text,
	"rotated_at" timestamp DEFAULT now() NOT NULL,
	"rotated_by_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "access_event" (
	"id" text PRIMARY KEY NOT NULL,
	"access_id" text NOT NULL,
	"user_id" text,
	"action" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "access" ADD CONSTRAINT "access_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "access" ADD CONSTRAINT "access_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "access" ADD CONSTRAINT "access_rotated_by_id_user_id_fk" FOREIGN KEY ("rotated_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "access_event" ADD CONSTRAINT "access_event_access_id_access_id_fk" FOREIGN KEY ("access_id") REFERENCES "public"."access"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "access_event" ADD CONSTRAINT "access_event_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "access_productId_idx" ON "access" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "access_event_accessId_idx" ON "access_event" USING btree ("access_id");
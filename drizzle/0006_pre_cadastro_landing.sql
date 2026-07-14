CREATE TABLE "pre_cadastro_submission" (
	"id" text PRIMARY KEY NOT NULL,
	"ip" text NOT NULL,
	"email" text,
	"whatsapp" text,
	"diagnostico_id" text,
	"resultado" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "diagnostico" ALTER COLUMN "classe" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "diagnostico" ADD COLUMN "atribuicao" text;--> statement-breakpoint
ALTER TABLE "diagnostico" ADD COLUMN "contato_cargo" text;--> statement-breakpoint
ALTER TABLE "diagnostico" ADD COLUMN "origem" text DEFAULT 'interno' NOT NULL;--> statement-breakpoint
ALTER TABLE "pre_cadastro_submission" ADD CONSTRAINT "pre_cadastro_submission_diagnostico_id_diagnostico_id_fk" FOREIGN KEY ("diagnostico_id") REFERENCES "public"."diagnostico"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pre_cadastro_submission_ip_idx" ON "pre_cadastro_submission" USING btree ("ip","created_at");
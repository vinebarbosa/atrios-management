CREATE TABLE "serventia" (
	"cns" text PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"cidade" text NOT NULL,
	"uf" text DEFAULT 'RN' NOT NULL,
	"situacao" text DEFAULT '' NOT NULL,
	"tipo" text,
	"natureza" text,
	"telefone" text,
	"email" text,
	"endereco" text,
	"responsavel" text,
	"ingresso" date,
	"arrec_periodo" text,
	"arrec_atual" numeric(14, 2),
	"arrec_anterior" numeric(14, 2),
	"atos" integer,
	"sincronizado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "serventia_uf_idx" ON "serventia" USING btree ("uf");--> statement-breakpoint
CREATE INDEX "serventia_cidade_idx" ON "serventia" USING btree ("cidade");--> statement-breakpoint
-- CNS antigos eram texto livre (sem tabela `serventia` para validar). Ao
-- introduzir a FK, zeramos vínculos órfãos para não violar a constraint —
-- vínculos legítimos passam a ser criados pela app contra a base seedada.
UPDATE "diagnostico" SET "cns" = NULL WHERE "cns" IS NOT NULL AND "cns" NOT IN (SELECT "cns" FROM "serventia");--> statement-breakpoint
ALTER TABLE "diagnostico" ADD CONSTRAINT "diagnostico_cns_serventia_cns_fk" FOREIGN KEY ("cns") REFERENCES "public"."serventia"("cns") ON DELETE set null ON UPDATE no action;
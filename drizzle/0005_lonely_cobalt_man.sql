CREATE TABLE "diagnostico" (
	"id" text PRIMARY KEY NOT NULL,
	"serventia" text NOT NULL,
	"cns" text,
	"municipio" text,
	"uf" text NOT NULL,
	"classe" integer NOT NULL,
	"subclasse" text,
	"modelo_solucao" text DEFAULT 'nao_sei' NOT NULL,
	"contato_nome" text NOT NULL,
	"contato_email" text,
	"contato_whatsapp" text,
	"escopo" text NOT NULL,
	"score_geral" integer,
	"status_funil" text DEFAULT 'em_andamento' NOT NULL,
	"criado_por_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parametro_norma" (
	"id" text PRIMARY KEY NOT NULL,
	"chave" text NOT NULL,
	"valor" text NOT NULL,
	"uf" text,
	"descricao" text
);
--> statement-breakpoint
CREATE TABLE "requisito" (
	"id" text PRIMARY KEY NOT NULL,
	"etapa" integer NOT NULL,
	"ref_normativa" text NOT NULL,
	"pergunta_tecnica" text NOT NULL,
	"pergunta_simples" text NOT NULL,
	"peso" integer NOT NULL,
	"classes" jsonb NOT NULL,
	"condicoes" jsonb,
	"ordem" integer NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resposta" (
	"id" text PRIMARY KEY NOT NULL,
	"diagnostico_id" text NOT NULL,
	"requisito_id" text NOT NULL,
	"valor" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resposta_identidade" (
	"id" text PRIMARY KEY NOT NULL,
	"diagnostico_id" text NOT NULL,
	"item" text NOT NULL,
	"valor" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "diagnostico" ADD CONSTRAINT "diagnostico_criado_por_id_user_id_fk" FOREIGN KEY ("criado_por_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resposta" ADD CONSTRAINT "resposta_diagnostico_id_diagnostico_id_fk" FOREIGN KEY ("diagnostico_id") REFERENCES "public"."diagnostico"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resposta" ADD CONSTRAINT "resposta_requisito_id_requisito_id_fk" FOREIGN KEY ("requisito_id") REFERENCES "public"."requisito"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resposta_identidade" ADD CONSTRAINT "resposta_identidade_diagnostico_id_diagnostico_id_fk" FOREIGN KEY ("diagnostico_id") REFERENCES "public"."diagnostico"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "diagnostico_statusFunil_idx" ON "diagnostico" USING btree ("status_funil");--> statement-breakpoint
CREATE INDEX "diagnostico_uf_idx" ON "diagnostico" USING btree ("uf");--> statement-breakpoint
CREATE INDEX "parametro_norma_chave_idx" ON "parametro_norma" USING btree ("chave");--> statement-breakpoint
CREATE INDEX "requisito_etapa_idx" ON "requisito" USING btree ("etapa");--> statement-breakpoint
CREATE UNIQUE INDEX "resposta_diagnosticoId_requisitoId_uq" ON "resposta" USING btree ("diagnostico_id","requisito_id");--> statement-breakpoint
CREATE UNIQUE INDEX "resposta_identidade_diagnosticoId_item_uq" ON "resposta_identidade" USING btree ("diagnostico_id","item");
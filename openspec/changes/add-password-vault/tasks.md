# Tasks: add-password-vault

## 1. Fundação — crypto, schema e seed

- [x] 1.1 Conferir em `node_modules/next/dist/docs/` o que for usado de novo (rotas irmãs/segmentos, composição server/client de modais) — Next 16 tem breaking changes
- [x] 1.2 `src/lib/vault-crypto.ts`: AES-256-GCM (`node:crypto`) com `VAULT_KEY` (32 bytes base64), erro explícito se ausente; `VAULT_KEY` documentada em `.env.example` e gerada no `.env` de dev
- [x] 1.3 `src/lib/vault-constants.ts`: catálogos de tipo (Sistema/Infra/Banco de dados/Plataforma/E-mail + cores) e ambiente (Produção/Homologação/Geral + cores), limiar de rotação velha (90 dias)
- [x] 1.4 Tabelas `access` e `access_event` em `src/db/schema.ts` (relations + índices), migration gerada e aplicada
- [x] 1.5 Seed: acessos do mockup (Pórtico, Cortina, Ábaco) cifrados com a chave de dev, incluindo dois com rotação > 90 dias

## 2. Actions

- [x] 2.1 `createAccess`/`updateAccess` em `src/app/cofre/actions.ts`: validação de obrigatórios, cifragem, senha vazia na edição mantém a atual, senha nova ⇒ `rotated_at/by` + evento `rotated`, criação ⇒ evento `created`, `revalidatePath`
- [x] 2.2 `getSecret(accessId, field, intent)`: decripta e retorna em claro; `reveal` exige admin (server-side), `copy` exige sessão; audita `viewed`/`copied`
- [x] 2.3 Garantir por construção que nenhuma query de página seleciona `password_enc`/`totp_codes_enc` (tipos de linha sem esses campos)

## 3. UI — aba Acessos do produto (frames 13–14)

- [x] 3.1 Extrair `ProductHeader` (breadcrumb + identidade do produto + abas Cards|Acessos com contagens) e usá-lo no board sem mudança visual; Contexto permanece só na aba Cards
- [x] 3.2 Rota `/produtos/[code]/acessos`: lista agrupada por ambiente (cabeçalho com dot/nome/contagem; linha com nome, chip de tipo, login mono, máscara, copiar, rotação com âmbar quando velha, avatar), busca client-side, estado vazio do frame 13b
- [x] 3.3 `AccessModal` (criar/editar, frame 14) ligado às actions, com erros inline e pré-preenchimento na edição (sem expor segredos — senha em branco = manter)

## 4. UI — detalhe e cofre global (frames 15–16)

- [x] 4.1 `AccessDetail` (frame 15): colunas campo/metadados, login com copiar, senha com revelar (só admin, Revelar/Ocultar) e copiar ("Copiar"→"Copiada"), 2FA mascarado com copiar, notas, Criado por, Última rotação, auditoria (mais recente primeiro); member sem olho (15b)
- [x] 4.2 Rota `/cofre` + item "Cofre" na sidebar (ícone chave): lista agrupada por produto (dot, nome, código mono, contagem), chip de ambiente na linha, filtro por produto (Todos + produtos com acessos), busca, "Novo acesso"; linha abre o detalhe
- [x] 4.3 Contagem da aba Acessos no header do produto e total no header do /cofre vindos do banco

## 5. Verificação

- [x] 5.1 Fluxo admin no browser: criar acesso → aparece na aba e no /cofre → revelar (auditoria "visualizou") → copiar ("Copiada" + auditoria) → editar com senha nova (rotação atualiza + evento) → editar sem senha (rotação intacta)
- [x] 5.2 Fluxo member: sem botão de revelar no detalhe, action de revelar recusa via chamada direta, copiar funciona e audita
- [x] 5.3 Conferir que o payload das páginas não contém segredos (view-source/RSC payload) e que `password_enc` não aparece fora de actions/crypto (grep)
- [x] 5.4 Cenários de borda: busca, filtro por produto, estado vazio, rotação âmbar, `VAULT_KEY` ausente ⇒ erro claro
- [x] 5.5 `npm run lint` e `npm run build` limpos

## Why

Convites já são criados e persistidos, mas `sendEmail` apenas escreve no console — nenhum email real chega ao convidado, então o fluxo de onboarding não funciona fora do ambiente de desenvolvimento. Precisamos entregar convites por email de verdade, com um template HTML condizente com a marca Átrios.

## What Changes

- Adicionar transporte real de email via **Resend** em `src/lib/email.ts`, mantendo o fallback de console quando não configurado.
- `sendEmail` passa a aceitar conteúdo **HTML** (além do `text` atual), sem quebrar os chamadores existentes (reset de senha continua em texto).
- Extrair o template de convite do arquivo bundler `Convite Átrios (standalone).html` para um HTML de email limpo em `public/emails/invite.html`, com placeholders `{{inviterName}}`, `{{roleLabel}}`, `{{inviteUrl}}` e `{{expiresInDays}}`.
- `sendInviteEmail` (em `src/app/time/actions.ts`) passa a carregar o template, preencher os placeholders e enviar o email em HTML.
- Adicionar variáveis de ambiente `INVITE_EMAIL_PROVIDER`, `RESEND_API_KEY` e `RESEND_FROM_EMAIL` ao `.env` e `.env.example`.

## Capabilities

### New Capabilities
- `invite-email`: entrega do convite por email — seleção de provedor (Resend ou console), template HTML da Átrios e preenchimento dos dados do convite.

### Modified Capabilities
<!-- Nenhuma capability de requisitos existente em openspec/specs/ (changes ainda não arquivadas). -->

## Impact

- **Código**: `src/lib/email.ts` (transporte Resend + suporte a HTML), `src/app/time/actions.ts` (`sendInviteEmail` renderiza template).
- **Assets**: novo `public/emails/invite.html` extraído de `Convite Átrios (standalone).html`.
- **Config**: `.env` / `.env.example` ganham `INVITE_EMAIL_PROVIDER`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`.
- **Dependências**: usa a API HTTP do Resend via `fetch` (sem novo pacote npm) — nenhum SDK adicional necessário.
- **Sem breaking changes**: chamadores atuais de `sendEmail` continuam funcionando; sem chaves configuradas o comportamento cai para o log de console de hoje.

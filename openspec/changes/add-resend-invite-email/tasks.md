## 1. Configuração

- [x] 1.1 Adicionar `INVITE_EMAIL_PROVIDER=resend`, `RESEND_API_KEY` e `RESEND_FROM_EMAIL` ao `.env` com os valores fornecidos
- [x] 1.2 Adicionar as mesmas três chaves ao `.env.example` com valores vazios/placeholder e um comentário explicando que sem provedor o envio cai para log de console

## 2. Template de email

- [x] 2.1 Extrair o HTML real do email do script `__bundler/template` em `Convite Átrios (standalone).html` (fazer o unescape da string JSON)
- [x] 2.2 Salvar o HTML limpo em `public/emails/invite.html`, mantendo os placeholders `{{inviterName}}`, `{{roleLabel}}`, `{{inviteUrl}}`, `{{expiresInDays}}`
- [x] 2.3 Verificar que o arquivo abre como email HTML íntegro (tabelas + estilos inline, sem o wrapper bundler)

## 3. Transporte de email (Resend)

- [x] 3.1 Estender `sendEmail` em `src/lib/email.ts` para aceitar um campo opcional `html`
- [x] 3.2 Quando `INVITE_EMAIL_PROVIDER=resend` e `RESEND_API_KEY` estiverem definidos, enviar via `POST https://api.resend.com/emails` (`from`=`RESEND_FROM_EMAIL`, `to`, `subject`, `html`, `text`)
- [x] 3.3 Manter o `console.log` como fallback quando o provedor não estiver configurado; tratar resposta de erro do Resend com log, sem lançar

## 4. Render do convite

- [x] 4.1 Em `sendInviteEmail` (`src/app/time/actions.ts`), carregar `public/emails/invite.html` via `fs/promises` a partir de `process.cwd()`
- [x] 4.2 Substituir os placeholders: `inviterName` (nome de quem convida, com fallback), `roleLabel` (`admin→Administrador`, `member→Membro`), `inviteUrl` (`${BETTER_AUTH_URL}/convite/${token}`), `expiresInDays` (derivado de `INVITE_TTL_MS`)
- [x] 4.3 Passar o `role` do convite para `sendInviteEmail` e enviar o email com `html` preenchido (mantendo `text` como fallback textual)

## 5. Verificação

- [ ] 5.1 Sem chaves configuradas: criar convite e confirmar que o conteúdo cai no log de console e o convite persiste
- [ ] 5.2 Com Resend configurado: criar e reenviar convite e confirmar que o email HTML chega ao destinatário com placeholders preenchidos e link `/convite/<token>` funcional
- [x] 5.3 Rodar `pnpm lint` e garantir que não há regressões nos demais chamadores de `sendEmail`

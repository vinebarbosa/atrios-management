# Proposal: add-password-vault

## Why

O time guarda credenciais compartilhadas (contas de plataforma, bancos, infra) fora do app, sem controle de acesso nem rastro. O design "Átrios Cofre (standalone).html" (frames 13–16, continuação do doc de Produtos) define o cofre de senhas por produto: acessos criptografados, cópia auditada, revelação restrita a admins e visão agregada — falta implementar.

## What Changes

- **Acessos por produto**: a página do produto ganha abas **Cards | Acessos** (frame 13); a aba lista os acessos agrupados por ambiente (Produção/Homologação/Geral), com busca, contagem, estado vazio e "Novo acesso".
- **Criar/editar acesso** (frame 14): modal único com nome, produto, tipo (Sistema/Infra/Banco de dados/Plataforma/E-mail), ambiente, login, senha, códigos 2FA e notas.
- **Segredos criptografados no servidor** (AES-256-GCM, chave em env): senha e códigos 2FA nunca vão ao client na renderização — só via action explícita.
- **Detalhe do acesso** (frame 15): revelar senha é **só de admin**; copiar é permitido a qualquer membro sem revelar; toda visualização/cópia gera evento de **auditoria** (criou, visualizou, copiou, rotacionou), exibida no painel.
- **Rotação**: editar a senha registra "rotacionou a senha" e atualiza "Última rotação"; rotação velha (> 90 dias) aparece em âmbar na lista.
- **Cofre global** (frame 16): item **Cofre** na sidebar → página com todos os acessos agrupados por produto, filtro por produto e busca.
- Seed de dev com os acessos do mockup.

Sem mudanças **BREAKING**.

## Capabilities

### New Capabilities

- `vault`: cofre de senhas — CRUD de acessos com segredos criptografados, aba por produto, visão global, revelação/cópia com permissões por papel e trilha de auditoria (frames 13–16).

### Modified Capabilities

- `products`: a página do produto ganha a navegação em abas Cards | Acessos (aditivo; spec principal ainda não sincronizado — vive em `openspec/changes/add-product-management/specs/products/`).

## Impact

- **Schema/migrations**: tabelas `access` e `access_event`; util de criptografia (`node:crypto`, sem dependências novas).
- **Config**: `VAULT_KEY` (32 bytes) em `.env` / `.env.example`.
- **Rotas novas**: `/produtos/[code]/acessos`, `/cofre`. **Alteradas**: `/produtos/[code]` (cabeçalho do produto extraído e compartilhado com abas), sidebar (`app-sidebar.tsx`) ganha "Cofre".
- **Actions novas**: criar/editar acesso, obter segredo (revelar/copiar) com checagem de papel e auditoria.
- **Fora de escopo**: rotação automática/lembretes, compartilhamento externo, botão dedicado de rotacionar (rotação = trocar a senha na edição), TOTP dinâmico (guardamos códigos de recuperação como texto).

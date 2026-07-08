# Spec delta: invite-email (add-resend-invite-email)

## ADDED Requirements

### Requirement: Entrega de convite por email
O sistema SHALL enviar um email real para o endereço convidado sempre que um convite for criado ou reenviado. O email SHALL conter um link de aceite para `/convite/<token>`. Quando o provedor de email estiver configurado, o envio SHALL usar esse provedor; caso contrário, o sistema SHALL registrar o conteúdo do email em log (comportamento de desenvolvimento) sem lançar erro.

#### Scenario: Convite criado com provedor configurado
- **WHEN** um admin cria um convite e `INVITE_EMAIL_PROVIDER=resend` com `RESEND_API_KEY` e `RESEND_FROM_EMAIL` definidos
- **THEN** o sistema envia via Resend um email HTML para o email convidado contendo o link `/convite/<token>`

#### Scenario: Reenvio de convite
- **WHEN** um admin reenvia um convite pendente
- **THEN** o sistema gera um novo token e envia um novo email HTML para o mesmo endereço com o link atualizado

#### Scenario: Sem provedor configurado
- **WHEN** um convite é criado e nenhum provedor de email está configurado
- **THEN** o sistema registra o conteúdo do email em log e o fluxo de criação do convite conclui com sucesso

#### Scenario: Falha no envio não bloqueia o convite
- **WHEN** o provedor está configurado mas a API do Resend retorna erro
- **THEN** o convite permanece persistido e o sistema registra a falha em log sem derrubar a operação

### Requirement: Template HTML de convite da Átrios
O sistema SHALL usar um template HTML de email hospedado em `public/emails/invite.html` para o corpo do convite. O template SHALL suportar os placeholders `{{inviterName}}`, `{{roleLabel}}`, `{{inviteUrl}}` e `{{expiresInDays}}`, todos substituídos pelos valores reais do convite antes do envio. O template SHALL ser um HTML de email standalone (tabelas, estilos inline, compatível com clientes de email), sem depender do runtime bundler do arquivo de referência.

#### Scenario: Placeholders preenchidos
- **WHEN** o sistema monta o email de convite para um destinatário
- **THEN** cada ocorrência de `{{inviterName}}`, `{{roleLabel}}`, `{{inviteUrl}}` e `{{expiresInDays}}` é substituída pelo valor correspondente do convite

#### Scenario: Papel exibido em português
- **WHEN** o convite tem role `admin` ou `member`
- **THEN** o email exibe um rótulo legível ("Administrador" ou "Membro") no lugar de `{{roleLabel}}`

#### Scenario: Link de aceite absoluto
- **WHEN** o email é montado
- **THEN** `{{inviteUrl}}` é substituído por uma URL absoluta baseada em `BETTER_AUTH_URL` apontando para `/convite/<token>`

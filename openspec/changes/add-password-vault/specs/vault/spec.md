# vault

## ADDED Requirements

### Requirement: Aba Acessos do produto

A página do produto SHALL exibir abas **Cards** e **Acessos** com contagens. A aba Acessos SHALL listar os acessos do produto agrupados por ambiente (Produção, Homologação, Geral), cada linha com nome, chip de tipo, login, senha mascarada, botão "Copiar senha", tempo desde a última rotação e avatar de quem criou. A aba SHALL ter busca por texto e o botão "Novo acesso".

#### Scenario: Lista agrupada por ambiente

- **WHEN** um membro abre a aba Acessos de um produto com acessos em mais de um ambiente
- **THEN** vê grupos com cabeçalho (nome do ambiente + contagem) e as linhas de cada grupo

#### Scenario: Estado vazio

- **WHEN** o produto não tem acessos
- **THEN** a aba exibe o estado vazio com ícone, "Nenhum acesso guardado", a nota de criptografia e o botão "Novo acesso"

#### Scenario: Busca filtra a lista

- **WHEN** o membro digita na busca
- **THEN** apenas acessos cujo nome ou login contêm o texto permanecem visíveis, mantendo o agrupamento

### Requirement: Criar e editar acesso

O sistema SHALL permitir criar e editar um acesso pelo mesmo modal, com campos: nome, produto, tipo (Sistema, Infra, Banco de dados, Plataforma, E-mail), ambiente (Produção, Homologação, Geral), login, senha, códigos 2FA (opcional) e notas (opcional). Nome, produto, tipo, ambiente, login e senha SHALL ser obrigatórios na criação. A criação SHALL registrar o evento de auditoria "criou o acesso".

#### Scenario: Criar acesso

- **WHEN** um membro salva o modal preenchido
- **THEN** o acesso aparece na aba do produto e na visão global, com senha mascarada e "Criado por" preenchido

#### Scenario: Validação de obrigatórios

- **WHEN** o membro salva sem nome, login ou senha
- **THEN** o sistema recusa com erro inline e mantém o modal aberto

#### Scenario: Editar sem trocar a senha

- **WHEN** o membro edita campos que não são a senha
- **THEN** as alterações persistem e "Última rotação" não muda

### Requirement: Segredos criptografados no servidor

Senha e códigos 2FA SHALL ser armazenados cifrados (AES-256-GCM com chave de ambiente) e NUNCA incluídos nos dados de renderização das páginas — o valor em claro só SHALL sair do servidor por action explícita de revelar ou copiar.

#### Scenario: Renderização sem segredos

- **WHEN** qualquer página do cofre é renderizada
- **THEN** o payload contém apenas valores mascarados, nunca a senha ou os códigos em claro

#### Scenario: Chave ausente

- **WHEN** `VAULT_KEY` não está configurada
- **THEN** as actions do cofre falham com erro explícito, sem gravar segredo em claro

### Requirement: Revelar e copiar com permissões por papel

Revelar a senha no detalhe SHALL ser permitido apenas a admins (botão de olho, alternando Revelar/Ocultar). Copiar a senha SHALL ser permitido a qualquer membro autenticado, sem exibi-la, com confirmação visual ("Copiar" → "Copiada"). Membros não-admin NÃO SHALL ver o botão de revelar, e a action de revelar SHALL recusar não-admins mesmo se invocada diretamente.

#### Scenario: Admin revela a senha

- **WHEN** um admin clica no olho no detalhe do acesso
- **THEN** a senha aparece em claro e o botão passa a "Ocultar"

#### Scenario: Member copia sem revelar

- **WHEN** um member clica em "Copiar" no campo Senha
- **THEN** a senha vai para a área de transferência sem ser exibida e o botão mostra "Copiada"

#### Scenario: Member não revela

- **WHEN** um member abre o detalhe do acesso ou chama a action de revelar diretamente
- **THEN** não há botão de revelar e a action retorna erro de permissão

### Requirement: Auditoria de acessos

O sistema SHALL registrar eventos por acesso — "criou o acesso", "visualizou a senha" (revelar), "copiou a senha", "rotacionou a senha" — com autor e momento, e exibi-los no painel de detalhe (mais recentes primeiro). Editar a senha SHALL registrar "rotacionou a senha" e atualizar "Última rotação".

#### Scenario: Cópia auditada

- **WHEN** qualquer membro copia a senha
- **THEN** um evento "copiou a senha" com o nome do membro aparece na auditoria do acesso

#### Scenario: Rotação registrada

- **WHEN** um membro salva a edição com uma senha nova
- **THEN** a auditoria ganha "rotacionou a senha" e "Última rotação" reflete a data e o autor

#### Scenario: Rotação velha destacada

- **WHEN** a última rotação de um acesso tem mais de 90 dias
- **THEN** o texto "rotacionada há X" aparece em âmbar na lista

### Requirement: Cofre global

A sidebar SHALL ter o item **Cofre** levando a uma página com todos os acessos agrupados por produto (cabeçalho com dot, nome, código e contagem), com filtro por produto ("Todos" + produtos com acessos), busca e "Novo acesso". As linhas SHALL incluir também o chip de ambiente. Clicar numa linha SHALL abrir o mesmo detalhe do acesso.

#### Scenario: Agregado por produto

- **WHEN** um membro abre /cofre
- **THEN** vê os mesmos acessos das abas dos produtos, agrupados por produto, com contagem total no cabeçalho

#### Scenario: Filtro por produto

- **WHEN** o membro seleciona um produto no filtro
- **THEN** apenas o grupo daquele produto permanece visível

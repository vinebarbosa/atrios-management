# product-board

## ADDED Requirements

### Requirement: Board de cards por produto

A página `/produtos/[code]` SHALL exibir os cards do produto vindos do banco em 4 colunas fixas de status — To Do, Em Progresso, Em Revisão, Concluído — nas visões Kanban e Lista (segmented control), com contagem real por coluna. Cada card SHALL mostrar id (`CODE-n`), título e, quando existirem, chip de repositório, badge de PR (`#n`) e badge "auto".

#### Scenario: Board reflete o banco

- **WHEN** um membro acessa `/produtos/POR`
- **THEN** as colunas exibem os cards persistidos do produto POR, distribuídos pelo status de cada card, com contagem correta por coluna

#### Scenario: Alternar visão

- **WHEN** o membro alterna entre Kanban e Lista
- **THEN** os mesmos cards e contagens aparecem na visão escolhida, sem nova busca desnecessária

#### Scenario: Produto inexistente

- **WHEN** o usuário acessa `/produtos/XYZ` e não existe produto com código XYZ
- **THEN** o sistema responde com página 404

### Requirement: Criação rápida de card

O sistema SHALL permitir criar um card pelo compositor inline da coluna To Do, com título obrigatório e repositório opcional. O id SHALL ser sequencial por produto (`CODE-n`, onde n é o próximo número, nunca reutilizado). Enter cria, Esc cancela; o card criado SHALL entrar no topo da To Do com destaque "novo".

#### Scenario: Criar card com sucesso

- **WHEN** um membro digita um título no compositor e pressiona Enter
- **THEN** o card é persistido com status To Do e o próximo id sequencial do produto, aparece no topo da coluna com destaque, e a contagem da coluna incrementa

#### Scenario: Ids sequenciais sem colisão

- **WHEN** dois membros criam cards no mesmo produto quase simultaneamente
- **THEN** cada card recebe um número distinto e sequencial

#### Scenario: Título vazio

- **WHEN** o membro pressiona Enter com o título vazio
- **THEN** nenhum card é criado

### Requirement: Painel do card

Clicar em um card SHALL abrir o painel modal com id, status, título, descrição e metadados (repositório, branch sugerida com botão de copiar, PR). O sistema SHALL permitir editar título, descrição e repositório do card pelo painel, persistindo as alterações. A branch sugerida SHALL ser derivada de `{id-minúsculo}-{palavras-do-título}`.

#### Scenario: Editar título e descrição

- **WHEN** um membro edita o título ou a descrição no painel
- **THEN** a alteração é persistida e refletida no board ao fechar o painel

#### Scenario: Alterar repositório do card

- **WHEN** um membro seleciona outro repositório do produto (ou "sem repo") no painel
- **THEN** o card passa a exibir o chip do novo repositório

#### Scenario: Copiar branch sugerida

- **WHEN** o membro clica no botão de copiar da branch sugerida
- **THEN** o nome da branch é copiado para a área de transferência

### Requirement: Mudança de status do card

O sistema SHALL permitir mover um card entre as 4 colunas alterando seu status pelo painel do card. A mudança SHALL persistir e atualizar as contagens das colunas e o indicador "em andamento" do produto.

#### Scenario: Mover card para outra coluna

- **WHEN** um membro muda o status de um card de "To Do" para "Em Progresso" no painel
- **THEN** o card aparece na coluna Em Progresso, as contagens das duas colunas se ajustam e a contagem "em andamento" do produto na lista `/produtos` reflete o novo total

### Requirement: Vínculo de Pull Request

O sistema SHALL permitir vincular um PR a um card colando o link no painel; o card SHALL exibir o badge `#n` com link externo. Deve ser possível remover o vínculo. A vinculação automática por integração GitHub está fora de escopo.

#### Scenario: Colar link de PR

- **WHEN** um membro cola `https://github.com/atrios/portico-api/pull/142` no campo de PR do painel
- **THEN** o card passa a exibir o badge `#142` linkando para o PR

#### Scenario: Link inválido

- **WHEN** o membro cola um texto que não é URL de PR do GitHub
- **THEN** o sistema recusa com mensagem de erro e mantém o estado anterior

# products

## ADDED Requirements

### Requirement: Listagem de produtos

O sistema SHALL exibir em `/produtos` todos os produtos persistidos no banco, ordenados por atualização mais recente, mostrando nome, código, descrição, contagem de cards em andamento e há quanto tempo foi atualizado. A sidebar SHALL listar os mesmos produtos com o dot na cor da etapa atual.

#### Scenario: Lista reflete o banco

- **WHEN** um membro autenticado acessa `/produtos`
- **THEN** vê a lista de produtos vinda do banco (não de mock), com contador total no cabeçalho

#### Scenario: Contagem de cards em andamento

- **WHEN** um produto tem N cards nas colunas "Em Progresso" ou "Em Revisão"
- **THEN** a lista exibe "N em andamento" (ou "—" quando N = 0)

#### Scenario: Sem produtos cadastrados

- **WHEN** não existe nenhum produto no banco
- **THEN** a lista exibe estado vazio com a ação "Novo produto" disponível

### Requirement: Criação de produto

O sistema SHALL permitir criar um produto pelo modal "Novo produto" informando nome, código e repositórios opcionais. O código SHALL ser único, ter de 2 a 4 caracteres alfanuméricos maiúsculos e servir de prefixo para os ids de card (`POR-12`). O produto criado SHALL iniciar na etapa "Descoberta".

#### Scenario: Criação com sucesso

- **WHEN** um membro submete o modal com nome "Pórtico", código "POR" e repositórios
- **THEN** o produto é persistido na etapa "Descoberta", aparece na lista e na sidebar, e o modal fecha

#### Scenario: Código duplicado

- **WHEN** um membro submete um código que já pertence a outro produto
- **THEN** o sistema recusa a criação e exibe erro inline, mantendo o modal aberto

#### Scenario: Código sugerido a partir do nome

- **WHEN** o usuário digita o nome sem ter editado o campo código
- **THEN** o código é sugerido automaticamente a partir do nome (3 letras maiúsculas, sem acentos)

#### Scenario: Validação de campos

- **WHEN** o nome está vazio ou o código não tem 2–4 caracteres alfanuméricos
- **THEN** o sistema recusa a criação com mensagem de erro

### Requirement: Etapa do produto com histórico

Todo produto SHALL estar em exatamente uma etapa dentre: Descoberta, Definição, Desenvolvimento, Testes, Em Produção, Descontinuado. O sistema SHALL permitir a um membro alterar a etapa pelo stepper do painel de contexto, registrando a data da mudança. O stepper SHALL destacar a etapa atual e exibir a data em que cada etapa passada foi atingida.

#### Scenario: Alterar etapa

- **WHEN** um membro seleciona outra etapa no stepper
- **THEN** a etapa é persistida com a data da mudança e o pill de status do cabeçalho, a cor do produto e a sidebar refletem a nova etapa

#### Scenario: Datas no stepper

- **WHEN** o painel de contexto é exibido
- **THEN** cada etapa já atingida mostra a data em que o produto entrou nela, e etapas futuras não mostram data

### Requirement: Repositórios do produto

O sistema SHALL permitir adicionar e remover repositórios de um produto (rótulo + nome sob a organização `atrios/`), tanto no modal de criação quanto no painel de contexto. Repositórios SHALL ser apenas registro com link para `https://github.com/atrios/<nome>` — a criação no GitHub está fora de escopo.

#### Scenario: Adicionar repositório no painel de contexto

- **WHEN** um membro adiciona um repositório com rótulo "api" e nome "portico-api"
- **THEN** o repositório aparece na seção Repositórios com link externo para o GitHub

#### Scenario: Produto sem repositórios

- **WHEN** um produto não tem repositórios
- **THEN** o painel de contexto exibe o botão tracejado "Adicionar repositório" como estado vazio

#### Scenario: Remover repositório

- **WHEN** um membro remove um repositório do produto
- **THEN** ele some da lista e cards que o referenciavam ficam "sem repo"

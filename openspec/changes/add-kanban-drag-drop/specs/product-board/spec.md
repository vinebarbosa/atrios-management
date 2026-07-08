# product-board

## ADDED Requirements

### Requirement: Arrastar cards entre colunas

Na visão Kanban, o sistema SHALL permitir mover um card arrastando-o e soltando-o sobre outra coluna, persistindo o novo status (mesma regra da mudança pelo painel). Durante o arrasto o card de origem SHALL aparecer esmaecido e a coluna sob o cursor SHALL ser destacada. O card SHALL aparecer na coluna de destino imediatamente (atualização otimista) e, se a persistência falhar, SHALL retornar à coluna original.

#### Scenario: Soltar card em outra coluna

- **WHEN** um membro arrasta um card de "To Do" e o solta sobre "Em Progresso"
- **THEN** o card passa a exibir-se em "Em Progresso" imediatamente, o status persiste e as contagens das duas colunas se ajustam

#### Scenario: Soltar na própria coluna

- **WHEN** o membro solta o card na mesma coluna de origem
- **THEN** nada muda e nenhuma mutação é enviada

#### Scenario: Falha na persistência

- **WHEN** a action de mudança de status retorna erro após o drop
- **THEN** o card volta à coluna original

#### Scenario: Feedback visual do arrasto

- **WHEN** um card está sendo arrastado sobre uma coluna válida
- **THEN** a coluna de destino é destacada e o card de origem fica esmaecido até o fim do gesto

#### Scenario: Visão Lista sem arrasto

- **WHEN** o membro está na visão Lista
- **THEN** as linhas não são arrastáveis e a mudança de status continua disponível pelo painel do card

# Blueprint do Produto — Plataforma de Conformidade Provimento 213 + LGPD

## Conceito

Um único produto com três camadas, cobrindo as 5 etapas do Anexo IV do início ao fim do ciclo de vida da serventia:

```
┌─────────────────────────────────────────────────────────┐
│  CAMADA 3 · PARCEIROS TÉCNICOS (marketplace)             │
│  backup imutável · firewall · pentest · infraestrutura   │
├─────────────────────────────────────────────────────────┤
│  CAMADA 2 · SERVIÇOS EMBUTIDOS (sua equipe)              │
│  DPO as a Service · sprints de adequação · testes        │
│  assistidos · simulações de desastre · identidade digital│
├─────────────────────────────────────────────────────────┤
│  CAMADA 1 · PLATAFORMA SaaS (o coração)                  │
│  M0 Diagnóstico → M1 Governança → M2 Continuidade →      │
│  M3 Acervo → M4 Validação → M5 Governança contínua       │
│  + Dossiê Técnico + Agenda Regulatória (transversais)    │
└─────────────────────────────────────────────────────────┘
```

A plataforma registra e comprova; os serviços executam; os parceiros fornecem a tecnologia que você não quer fabricar. Tudo desagua no **Dossiê Técnico** — o ativo que a fiscalização pede e que prende o cliente.

## Módulos transversais (nascem no dia 1)

**Dossiê Técnico Digital** — repositório de evidências por etapa/requisito, com hash e assinatura digital para C2/C3 (Anexo IV, disposição IV) e relatório simplificado para C1 (disposição VI-VII). Toda ação em qualquer módulo gera evidência aqui automaticamente. Retenção mínima de 5 anos.

**Agenda Regulatória** — motor de obrigações recorrentes parametrizado por classe: teste de restauração (semestral C3 / anual C1-C2), simulação de desastre (anual), declaração renovada no Justiça Aberta (anual, art. 17 §1º), reenquadramento de classe (anual, art. 16 §1º), teste de reversibilidade (24/30/36 meses), revisão da PSI, renovação de certificados. Alertas por e-mail/WhatsApp. **É o antídoto do churn: cancelar = voltar a controlar prazo regulatório no caderno.**

## Módulos por etapa

### M0 — Diagnóstico e enquadramento (porta de entrada, já construído)
Roteiro de call, cálculo de classe/subclasse, prazos art. 20/23, score por etapa, gaps com referência normativa, ofertas de identidade digital.

### M1 — Governança e LGPD (Etapa 1) ← foco atual
- Termos de designação gerados e assinados: responsável técnico, controlador, DPO
- **PSI Builder**: wizard que monta a Política de Segurança com o conteúdo mínimo do Anexo III preenchido com a realidade da serventia
- **ROPA Builder**: registro das operações de tratamento guiado por templates por especialidade (notas, RI, RCPN, protesto — cada um trata dados diferentes)
- Inventário de ativos (hardware, software, certificados, contratos) com data de vencimento
- Gestão de contratos de fornecedores: checklist das 7 cláusulas do item 1.8 por contrato
- **Central de Incidentes**: botão de pânico → classificação de gravidade → contagem regressiva 72h → minutas prontas (Corregedoria e ANPD) → análise de causa raiz → evidência no dossiê
- Registro da declaração de conclusão no Justiça Aberta

### M2 — Infraestrutura e continuidade (Etapa 2) ← foco atual
- Checklist de infraestrutura com upload de evidência (foto do no-break, laudo de aterramento, teste de velocidade)
- **PCN/PRD Builder**: wizard com matriz de riscos, RTO/RPO pré-preenchidos pelos mínimos da classe (Anexo II, 2.1-2.2), medidas de 30/90 dias
- Documento de arquitetura/topologia gerado a partir de perguntas guiadas (item 2.8)
- **EOL Tracker**: cruza o inventário com datas de fim de suporte (Windows, SQL Server etc.) e avisa antes de virar não conformidade (art. 4º §3º)

### M3 — Proteção do acervo (Etapa 3) — via parceiros + monitoramento
Você não fabrica backup nem firewall; orquestra e **comprova**:
- Marketplace de parceiros homologados (backup imutável, firewall/IPS, nuvem) com rev-share
- Monitor de conformidade: recebe os relatórios/alertas das ferramentas dos parceiros (e-mail/API) e transforma em evidência de backup executado, alerta de falha registrado (itens 3.2-3.3)
- Registro de chaves criptográficas e certificados (inventário, custódia, rotação — item 3.1)
- Checklist de criptografia e segmentação de rede com evidências

### M4 — Validação (Etapa 4) — serviços assistidos de alta margem
- **Wizard do Teste de Restauração**: passo a passo na tela durante o teste → gera a Ata do Anexo V preenchida e assinada → dossiê. Vendido como serviço assistido (sua equipe conduz por call)
- Simulação de desastre guiada: roteiro de tabletop por cenário (ransomware, incêndio, falha de fornecedor), ata automática
- Gestão de vulnerabilidades: registro com prazos 30 dias/72h e trilha para o dossiê
- Pentest via parceiro para C3 (ou validação do relatório coletivo do fornecedor — Anexo II, 6.3)

### M5 — Governança contínua (Etapa 5) — o modo perpétuo
- **Academy**: micro-treinamentos de segurança para escreventes (vídeo 10 min + quiz) com registro automático de presença = evidência do item 5.3 sem esforço
- Teste de reversibilidade agendado e documentado (24/30/36 meses)
- Revisão anual da PSI com diff do que mudou na norma
- Renovação anual da declaração no Justiça Aberta com síntese do dossiê pronta

## DPO as a Service — o serviço-âncora da recorrência

O provimento exige encarregado "quando aplicável" (art. 7º §2º) e a ANPD admite DPO pessoa jurídica/externo. Cartório de interior não tem quem nomear — você vira o encarregado.

**Entregáveis do serviço:**
- Nomeação formal como encarregado (evidência da Etapa 1, item 1.1)
- **Canal do titular**: formulário "seus dados" publicado no site da serventia (sinergia direta com o produto de identidade digital — o site que você vende hospeda o canal que o DPO exige)
- **Gerador de requerimentos do titular** (diferencial de quem conhece o balcão): modelos automáticos como "localização dos meus dados na serventia" e "eliminação de dado desnecessário ao ato" (ex: certidão de casamento exigida para abertura de firma, quando o ato só pede identidade, CPF e comprovante de residência). O fluxo completo: requerimento → análise → resposta formal ao cidadão ("acolhido; documento descartado com base no Provimento 50/2015-CNJ — tabela de temporalidade e descarte") → **evidência do descarte (foto/vídeo/termo de trituração ou incineração) arquivada no dossiê**. O cartório responde com prova, não com promessa.
- Atendimento às solicitações de titulares com SLA e registro (acesso, correção, informação — respeitando os limites da publicidade registral)
- Parecer e condução em incidentes (par com a Central de Incidentes do M1)
- Revisão periódica do ROPA e da PSI
- Interface com ANPD e Corregedoria quando necessário
- Relatório trimestral do encarregado → evidência no dossiê

**Escala por classe (pool compartilhado):**
| Classe | Modelo | Referência de preço |
|--------|--------|--------------------|
| C1 | 1 DPO para N serventias, atendimento por demanda + relatório trimestral | mensalidade baixa (volume) |
| C2 | pool com horas dedicadas + reunião semestral | mensalidade média |
| C3 | DPO nomeado com reunião trimestral e presença em fiscalizações | mensalidade alta |

**Cuidados**: contrato bem desenhado delimitando responsabilidade (a responsabilidade legal pelo tratamento permanece pessoal do delegatário — art. 7º); ter advogado/especialista em proteção de dados na equipe ou parceiro jurídico; evitar conflito de interesse (o DPO fiscaliza inclusive os serviços que a sua própria empresa presta — separar papéis internamente).

## Modelo de receita (resumo)

| Fonte | Tipo | Etapas |
|-------|------|--------|
| Sprint de Adequação Inicial (por classe) | projeto | 1-2 |
| Mensalidade da plataforma (por classe) | recorrente | todas |
| DPO as a Service (por classe) | recorrente | 1 + contínuo |
| Testes assistidos (restauração, simulação, reversibilidade) | recorrente anual | 4-5 |
| Identidade digital (site, e-mail, número) | setup + mensalidade | transversal |

**Identidade digital — escopo do pacote**: site com domínio próprio incluindo canal oficial LGPD, solicitações online e acompanhamento de protocolo pelo cidadão; vinculação com as plataformas oficiais (CRC Nacional, RI Digital, RTDPJ Brasil, e-Protocolo, e-Notariado e o novo Meu Registro); e-mail corporativo individual; número/WhatsApp corporativo. Onboarding padronizado em até 7 dias.

**Posicionamento (o que concorrente de TI não copia)**: a equipe vem de dentro do cartório. Consultorias de tecnologia entregam o "robusto por cima, pelo que a lei diz"; a Átrios sabe como o ato funciona na prática — quais documentos cada ato realmente exige, como o balcão atende, o que a Corregedoria olha. Todo material comercial e todo template do produto carrega essa voz.
| Marketplace de parceiros (backup, firewall, pentest) | rev-share | 3-4 |

## Sequência de construção

1. **Agora**: M0 (pronto) + M1 + M2 + Dossiê + Agenda — vende o sprint Etapas 1-2 com o portal incluso
2. **Desde o dia 1, sem código extra**: Etapas 3-5 aparecem na Agenda Regulatória como obrigações com checklist genérico e upload de evidência — o cliente já enxerga o caminho completo (e o contrato já prevê as fases seguintes)
3. **Conforme a carteira avança para a Etapa 3**: monitor de parceiros (M3) e wizard de testes (M4)
4. **Ano 2**: Academy (M5), painel coletivo para Anoreg/sindicato, expansão para outros estados

Regra de ouro: requisitos, prazos e classes vivem em banco de dados parametrizado por norma — quando o CNJ editar o provimento ou uma CGJ estadual regulamentar diferente, atualiza-se dado, não código.

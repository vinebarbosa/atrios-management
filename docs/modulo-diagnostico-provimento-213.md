# Módulo: Diagnóstico de Adequação — Provimento CNJ 213/2026 + LGPD
> Validado contra o texto oficial (Provimento n. 213, de 20/02/2026, Corregedoria Nacional de Justiça — SEI 2499251).

## Fluxo geral

```
Comercial gera link do formulário
        │
        ▼
Cartório preenche (10-15 min, autoavaliação)
        │
        ▼
Motor de diagnóstico
  1. Define CLASSE e SUBCLASSE pela arrecadação bruta semestral (art. 16)
  2. Identifica o MODELO DE SOLUÇÃO (própria/contratada/SaaS/compartilhada/coletiva — art. 13)
  3. Filtra requisitos aplicáveis à classe e ao modelo
  4. Calcula % de conformidade por ETAPA (1 a 5, Anexo IV)
  5. Calcula PRAZOS: art. 20 (Etapas 1-2) e art. 23 (total) — mostra dias restantes/vencidos
        │
        ▼
Relatório de diagnóstico
  - Score geral + por etapa · gaps priorizados · situação de prazo
  - Plano de adequação na ordem do Anexo IV → gancho da proposta
        │
        ▼
Comercial apresenta proposta com o diagnóstico em mãos
```

---

## Parâmetros oficiais (hardcode do motor)

### Classes — art. 16 (arrecadação bruta semestral)
| Classe | Faixa | Subclasses |
|--------|-------|------------|
| 1 | até R$ 100.000 | A (≤1/3), B (1/3–2/3), C (2/3–teto) |
| 2 | > R$ 100.000 até R$ 500.000 | D, E, F (terços do teto) |
| 3 | > R$ 500.000 | G (≤3×500k), H (3–6×), I (6–12×), J (>12×) |

Valores corrigidos anualmente pelo IPCA. Reenquadramento anual; variação ≤10% do teto exige 2 ciclos para migrar.

### Prazos (contados da entrada em vigor — fev/2026)
| | Classe 3 | Classe 2 | Classe 1 |
|---|---|---|---|
| Etapas 1+2 obrigatórias (art. 20) | **90 dias** | **150 dias** | **210 dias** |
| Todas as 5 etapas (art. 23) | 24 meses | 30 meses | 36 meses |

Prorrogação única de até 90 dias mediante plano formal (art. 21). **⚠️ Em jul/2026 o prazo do art. 20 já venceu para C3 e C2 e vence em breve para C1 — é o argumento central de urgência do relatório.**

### Parâmetros técnicos por classe
| Parâmetro | C1 | C2 | C3 |
|---|---|---|---|
| RPO máximo (Anexo II, 2.1) | 24h | 12h | 4h |
| RTO máximo (Anexo II, 2.2) | 24h | 24h | 8h |
| Backup completo (Anexo IV, 3.2) | ≤72h | ≤48h | ≤24h |
| Internet de referência (Anexo I) | 2 Mbps | 10 Mbps | 50 Mbps |
| Teste de restauração | anual | anual | semestral |
| Trilha de auditoria mínima (art. 10) | Essencial | Essencial | Intermediário |
| Pentest (Anexo II, 6) | — | — | bienal* |
| Teste de reversibilidade (5.6.1) | 36 meses | 30 meses | 24 meses |
| Segmentação de rede (art. 8, VII) | medida simplificada | VLAN obrigatória | VLAN obrigatória |
| Comprovação | relatório simplificado | dossiê + hash assinado | dossiê + hash assinado |

\* Dispensado para C3 100% SaaS/centralizado sem servidores locais, mediante relatório do fornecedor + declaração do titular (Anexo II, 6.3). Regra fixa: comunicação de incidente crítico à Corregedoria em até 72h (meta 24h) + ANPD quando envolver dados pessoais; vulnerabilidade crítica corrigida em 30 dias (72h se exploração ativa); retenção de logs e evidências por 5 anos; simulação de desastre anual.

---

## 1. Formulário

Respostas: **Sim / Parcial / Não / Não sei** ("Não sei" = Não, sinalizado como ponto de levantamento).

### Bloco 0 — Identificação e enquadramento
- Serventia, especialidade(s), UF/município, CNS
- Responsável + contato
- Arrecadação bruta semestral (faixas) → **classe/subclasse**
- **Modelo de solução tecnológica** (art. 13): própria / contratada (SaaS ou local) / compartilhada / coletiva — muda requisitos (pentest, dossiê coletivo, dependência estrutural)
- Nº de estações, fornecedor de sistema atual
- Já registrou alguma declaração de etapa no Justiça Aberta? Qual?

### Bloco 1 — Etapa 1: Governança e LGPD
1. Responsável técnico interno designado formalmente? (1.1)
2. Encarregado/DPO designado, quando aplicável? (1.1)
3. PSI elaborada, aprovada e divulgada com o conteúdo mínimo do Anexo III? (1.2)
4. Autenticação individualizada + MFA nos acessos administrativos, sem credenciais compartilhadas? (1.3)
5. Registro das operações de tratamento de dados pessoais (art. 7º §1º)? (1.4)
6. Procedimento de comunicação de incidentes críticos à Corregedoria (≤72h) e à ANPD? (1.5-1.6)
7. Inventário completo de ativos, integrações, certificados e contratos? (1.7)
8. Softwares licenciados e contratos com cláusulas de confidencialidade, reversibilidade, portabilidade em formato aberto, gestão de incidentes e LGPD? (1.8)
9. Declaração da Etapa 1 registrada no Justiça Aberta? (1.9)

### Bloco 2 — Etapa 2: Infraestrutura e continuidade
10. No-break com autonomia ~30 min + aterramento com laudo (art. 12 §8º)? (2.1)
11. Plano de contingência energética? (2.2)
12. Ambiente físico dos equipamentos críticos com acesso restrito e proteção contra incêndio/inundação/térmica? (2.3)
13. Conectividade compatível com a classe (ou backup comprovadamente dentro do RPO)? (2.4)
14. PCN + PRD formalizados com riscos, mitigação, RTO/RPO e medidas de 30/90 dias? (2.5)
15. Equipamentos adequados + suporte técnico contínuo? (2.6)
16. Antivírus/antimalware em todas as estações e servidores? (2.7)
17. Documento de arquitetura: topologia, ambientes, fluxos críticos, local dos backups, integrações, redundância? (2.8)
18. Sistemas/SGBD/aplicações sem EOL, com evidência de suporte vigente (art. 4º §3º)?
19. Declaração da Etapa 2 no Justiça Aberta? (2.9)

### Bloco 3 — Etapa 3: Proteção do acervo
20. Criptografia em trânsito (TLS 1.2+) e em repouso (AES-256) inclusive backups? (3.1)
21. Gestão formal de chaves: inventário, custódia segregada, rotação, registro? (3.1)
22. Backup completo dentro do prazo da classe + incrementais dentro do RPO? (3.2)
23. Backup em 2 ambientes independentes, ao menos 1 imutável/anti-ransomware (WORM/retention lock)? (3.2, III-d)
    - *C1/C2: aceita nuvem comercial se criptografado na origem com chave sob custódia exclusiva da serventia (3.2.1.1)*
24. Monitoramento de backup com alerta automático e registro de falha? (3.3)
25. Firewall stateful com IPS/IDS + segmentação lógica de rede? (3.4) *(C1: proteção perimetral simplificada documentada — art. 8º §5º)*
26. SGBD com integridade transacional e logs ativos? (3.6)
27. Tolerância a falhas / alta disponibilidade compatível com a classe? (3.7)
28. Trilhas de auditoria imutáveis, com NTP, usuário, data/hora, integradas ao backup? (3.8)
29. Declaração da Etapa 3 no Justiça Aberta? (3.9)

### Bloco 4 — Etapa 4: Monitoramento e validação
30. Relatório de conformidade das trilhas de auditoria (imutabilidade, NTP, retenção 5 anos)? (4.1)
31. Rotina documentada de atualização de sistemas? (4.2)
32. Gestão formal de vulnerabilidades (críticas ≤30 dias; ≤72h se exploração ativa)? (4.3)
33. Simulação anual de desastre validando PCN/PRD? (4.4)
34. Testes de restauração documentados na periodicidade da classe, com ata (Anexo V)? (4.5)
35. Avaliações técnicas periódicas de segurança? (4.6)
36. *(só C3)* Pentest bienal ou relatório coletivo do fornecedor? (4.7)
37. Análise de causa raiz de todos os incidentes? (4.8)
38. Declaração da Etapa 4 no Justiça Aberta? (4.9)

### Bloco 5 — Etapa 5: Interoperabilidade e governança contínua
39. Sistemas interoperáveis com plataformas de fiscalização (formato aberto, canal seguro, logs — art. 19)? (5.1)
40. Padrões abertos (PDF/A, XML) e prevenção de dependência de fornecedor? (5.2)
41. Capacitação periódica com registro formal? (5.3)
42. Revisão da PSI e dos padrões criptográficos a cada mudança relevante? (5.4)
43. Evidências auditáveis guardadas por 5 anos? (5.5)
44. Plano de reversibilidade + simulação documentada de extração integral do acervo em formato não proprietário, na periodicidade da classe? (5.6)
45. Declaração da Etapa 5 no Justiça Aberta? (5.7)

---

## 2. Motor de diagnóstico

Tabela de requisitos + regra de três. Sem IA.

```
requisito: { id, etapa, ref_normativa, pergunta, peso (1-3),
             classes_aplicaveis, condicoes (ex: modelo=SaaS dispensa pentest) }

score_etapa  = Σ pontos / Σ pontos aplicáveis   (Sim 1.0 · Parcial 0.5 · Não 0)
status_etapa = ≥80% Adequado · 40-79% Atenção · <40% Crítico
urgencia     = f(classe, hoje - data_vigencia)  → "prazo art. 20 vencido há N dias"
```

Peso 3 (gap "crítico"): MFA, criptografia, backup imutável, PCN/PRD, comunicação de incidentes, registro LGPD — são os itens que o art. 22 exige "desde o primeiro ciclo" mesmo no regime progressivo. Peso 1-2: documentação, capacitação, interoperabilidade.

## 3. Relatório de saída

1. Capa: serventia, classe/subclasse, modelo de solução.
2. **Alerta de prazo**: situação frente ao art. 20 (Etapas 1-2) e art. 23 (total), com a opção de prorrogação do art. 21 se aplicável.
3. Score geral + gráfico por etapa.
4. Gaps priorizados com referência normativa exata (ex: "Anexo IV, 3.2, III-d") e risco associado (PAD do art. 24, sanção ANPD, ransomware).
5. Plano de adequação na ordem sequencial do Anexo IV — obrigatória: etapa posterior não pode ser declarada sem a anterior. Marcar o que a sua empresa executa em cada etapa.
6. CTA: apresentação da proposta.

## 4. Modelo de dados mínimo

```
requisitos    (id, etapa, ref_normativa, pergunta, peso, classes, condicoes, ordem)
diagnosticos  (id, serventia, cns, classe, subclasse, modelo_solucao, contato, criado_em, score)
respostas     (diagnostico_id, requisito_id, valor)
```

Requisitos em tabela, não em código — art. 16 §2º corrige os tetos pelo IPCA todo ano.

## 5. Roadmap

1. **v1**: formulário + score + relatório PDF. Já vende.
2. **v2**: painel comercial (funil de diagnósticos).
3. **v3 (recorrência)**: portal de acompanhamento da adequação — a norma gera obrigações contínuas que renovam contrato: declaração anual no Justiça Aberta (art. 17 §1º), testes de restauração anuais/semestrais, simulação de desastre anual, reenquadramento anual de classe, teste de reversibilidade periódico. **Bônus fácil**: gerador da Ata de Teste de Restauração — o Anexo V já traz o modelo oficial campo a campo, é literalmente um formulário → PDF.

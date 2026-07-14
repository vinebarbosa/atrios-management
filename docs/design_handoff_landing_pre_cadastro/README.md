# Handoff: Landing pública de pré-cadastro — Diagnóstico gratuito CNJ 213/2026

## Overview
Landing page **pública** (fora do login) para captar pré-cadastros do "Diagnóstico gratuito de adequação ao Provimento CNJ 213/2026". Distribuída por link no WhatsApp e QR code; aberta majoritariamente no celular, mas também no desktop (WhatsApp Web no cartório). O visitante preenche 6 campos e a equipe faz o contato para agendar uma call de 20 minutos.

Público: titulares, interinos e escreventes de cartórios extrajudiciais. Tom institucional, claro, sem jargão de tecnologia.

## About the Design Files
Os arquivos deste pacote são **referências de design feitas em HTML** — protótipos que mostram o visual e o comportamento pretendidos, **não** código de produção para copiar direto. A tarefa é **recriar estes designs no ambiente/codebase alvo** (React, Vue, etc.) usando os padrões e a biblioteca de UI já estabelecidos ali. Se ainda não houver um ambiente, escolha o framework mais adequado e implemente.

O HTML-fonte é um "Design Component" (`.dc.html`): o markup real fica entre as tags conceituais, com estilos **inline**, e os valores dinâmicos (contador de dias, exibir logos de parceria) são injetados por uma pequena classe de lógica. Leia o markup e os estilos inline — ignore a mecânica do runtime (`support.js`, `<x-dc>`, `{{ ... }}`), que é só do ambiente de prototipagem.

## Fidelity
**Hi-fi.** Cores, tipografia, espaçamentos, raios e estados finais. Recrie a UI fielmente usando a biblioteca do codebase. Paleta e tipografia seguem o design system Átrios (dark, institucional, inspirado no Linear).

## Screens / Views
O protótipo tem 5 telas dispostas lado a lado num canvas. Todas compartilham o mesmo fundo escuro e o cartão de formulário.

### 1a — Mobile (390px) — página completa
Coluna única, rolagem curta. Ordem vertical:
1. **Topo**: logo Átrios (à esquerda, `height 46px`, renderizado em branco via `filter: invert(1)`) + bloco "Realização / apoio" à direita com os logos de parceria (Arpen/RN, Anoreg/RN) sobre chips claros (`#f4f5f7`, radius 6px). O bloco de parceria é **condicional** (só aparece quando a parceria estiver formalizada).
2. **Título** (`h1`, 27px/700, `#f2f2f4`): "Diagnóstico gratuito do Provimento CNJ 213/2026".
3. **Subtítulo** (15px, `#a9abb5`): "Descubra em uma conversa de 20 minutos o que a sua serventia já cumpre e o que ainda falta, com relatório por escrito."
4. **Faixa de urgência** (card tint vermelho): borda `rgba(224,108,108,0.22)`, fundo `rgba(224,108,108,0.06)`, radius 12px. Rótulo "PRAZO DAS ETAPAS 1 E 2 NO RN" (11px, uppercase, `#e08a8a`) + nota "Já com a prorrogação de 90 dias concedida pela Corregedoria (CGJ-RN)". Grid de 3 colunas: Classe 3 / Classe 2 / Classe 1, cada uma com número grande (25px/700, `#e06c6c`) + "dias" + data-limite (10.5px, `#6b6f7a`): 19/08/2026, 18/10/2026, 17/12/2026.
5. **Formulário** (card `#111214`, borda sutil, radius 14px) — ver "Formulário" abaixo.
6. **Como funciona**: 3 passos, cada um com ícone em quadrado 36px (fundo `rgba(94,106,210,0.12)`, radius 9px), título 14.5px/600 e descrição 13px `#787c88`.
7. **Rodapé de confiança**: frase de posicionamento + contatos (contato@atrioss.com · WhatsApp +55 84 4042-0438) + link "Política de privacidade".

### 1b — Mobile — erros de validação inline
Mesmo formulário no estado de erro. Campos inválidos: borda `rgba(224,108,108,0.55)` + glow `0 0 0 3px rgba(224,108,108,0.10)`, e abaixo uma mensagem 12px `#e06c6c` com ícone de alerta. Regras demonstradas:
- Campo obrigatório vazio → "Campo obrigatório."
- WhatsApp incompleto → "Informe um número com DDD, ex.: (84) 9 0000-0000."
- E-mail inválido → "Informe um e-mail válido."

### 1c — Mobile — sucesso pós-envio
Substitui o formulário. Ícone de check em círculo verde (`#4cb782`, fundo `rgba(76,183,130,0.10)`), título "Recebemos seu cadastro!" (23px/700), texto "Vamos te chamar no WhatsApp em até 1 dia útil para combinar o melhor horário da conversa de 20 minutos." e botão secundário outline verde "Chamar agora no WhatsApp" → link `https://wa.me/558440420438`. Rodapé de confiança repetido.

### 1d — Desktop 1366×768 — duas colunas
Formulário sempre visível **sem rolagem** em 1366px.
- **Coluna esquerda** (`flex:1`, padding 44–56px): logo + parceria, título (33px), subtítulo (16px), faixa de urgência (mesma do mobile, max-width 560px), "Como funciona" (3 passos compactos), rodapé de confiança.
- **Coluna direita** (largura fixa 560px, centralizada verticalmente): cartão de formulário com campos em grid 2-colunas (Município + Atribuição na mesma linha; Seu nome + Cargo; WhatsApp + E-mail). Inputs com `height 42px`.

### 1e — Open Graph 1200×630
Imagem de preview do link no WhatsApp. Fundo dark com marca d'água do ícone. Logo Átrios grande (104px), kicker "DIAGNÓSTICO GRATUITO" (`#8b93ec`), headline 64px/700 "Sua serventia está pronta para o Provimento CNJ 213/2026?" e 3 chips pill (20 minutos · Relatório por escrito · Sem custo). Abaixo, no canvas, um bloco documentando as meta tags — **implementar no `<head>`**:
- `og:title` = "Diagnóstico gratuito — Provimento CNJ 213/2026"
- `og:description` = "Descubra o que sua serventia já cumpre e o que falta. 20 minutos, com relatório."
- `og:image` = exportar a tela 1e em 1200×630 (PNG)
- Recomendado incluir também `twitter:card=summary_large_image` e as versões `twitter:*`.

## Formulário — campos (exatamente 6, nada além)
Todos com label visível acima do campo. Altura confortável para toque (mobile 48px; desktop 42px). `*` = obrigatório.
1. **Nome da serventia*** — texto. Placeholder "Ex.: Cartório do 1º Ofício de Notas".
2. **Município / UF*** — select de municípios do RN (Natal, Mossoró, Parnamirim, São Gonçalo do Amarante, Macaíba, Caicó, Ceará-Mirim, Açu, Currais Novos, Outro município). Considerar autocomplete se a lista real for grande.
3. **Atribuição da serventia*** — select: Ofício único (misto) · Notas · Registro de Imóveis · Registro Civil (RCPN) · Protesto · Títulos e Documentos / PJ · Não sei informar.
4. **Seu nome*** — texto + **Cargo** (select opcional): Titular · Interino · Escrevente · Outro.
5. **WhatsApp*** — telefone com máscara `(84) 9 0000-0000` **(máscara não implementada no protótipo — implementar)**.
6. **E-mail*** — email.

- **Botão primário** largo: "Quero meu diagnóstico gratuito" (`#5e6ad2`, texto branco, radius 8px, sombra sutil; hover `#6b76e0`). Mobile height 52px, desktop 48px.
- **Microcopy sob o botão** (transparência LGPD art. 9º, sem checkbox): "Sem compromisso. Ao enviar, seus dados serão usados exclusivamente para contato sobre o diagnóstico e a adequação ao Provimento 213/2026. [Política de privacidade]".

**Não adicionar nenhum campo além destes** — sem CNS/CNPJ (a equipe completa internamente).

## Interactions & Behavior
- **Submit**: validar inline (obrigatórios, formato de e-mail, telefone com DDD). Em sucesso → trocar o formulário pela tela 1c. **A lógica de envio é mock no protótipo** — plugar no endpoint do módulo de diagnóstico (já implementado no sistema).
- **Máscara de telefone**: aplicar no input WhatsApp.
- **Contador de dias**: no protótipo os valores são mockados (Classe 3 = 37, Classe 2 = 97, Classe 1 = 157). **Calcular dinamicamente** = dias corridos entre "hoje" e cada data-limite (19/08/2026, 18/10/2026, 17/12/2026), com piso em 0. Datas já consideram a prorrogação de 90 dias da CGJ-RN — confirmar as datas oficiais antes de ir ao ar.
- **Logos de parceria**: exibir apenas quando a parceria estiver formalizada (flag `showPartners`).
- **Hover states**: botão primário clareia; botão WhatsApp ganha leve fundo verde translúcido.
- **Acessibilidade**: labels visíveis, contraste AA, alvos de toque ≥44px, foco visível nos campos (borda azul `rgba(94,106,210,0.55)` + glow).

## State Management
- `form`: { nomeServentia, municipioUF, atribuicao, seuNome, cargo?, whatsapp, email }
- `errors`: mapa campo → mensagem
- `status`: 'idle' | 'submitting' | 'success' | 'error'
- `showPartners`: boolean (config)
- `prazos`: derivado das datas-limite vs. data atual (não é estado editável)

## Design Tokens
Cores:
- Fundo página: `#06070a` (radial escurecendo); cartões de tela mobile: gradiente `#0d1018 → #07080b`
- Cartão de formulário: `#111214`; inputs: `#0a0b0d`, borda `rgba(255,255,255,0.10)`
- Texto: título `#f2f2f4`, corpo `#a9abb5`, secundário `#787c88`, label `#b6b9c2`, muted `#4f525b`/`#6b6f7a`
- Primária (ação/marca): `#5e6ad2`, hover `#6b76e0`, acento `#8b93ec` / `#a9b0ec`
- Alerta/erro (urgência e validação): `#e06c6c`, tint `rgba(224,108,108,0.06)`
- Sucesso: `#4cb782` / `#58c48f`
- Chip de logo de parceria: fundo `#f4f5f7`
Tipografia: **Inter** (400/500/600/700). Escala usada: h1 mobile 27px, h1 desktop 33px, subtítulo 15–16px, corpo 13–15px, labels 12.5–13px, microcopy 11.5–12px, número do contador 25–27px, OG headline 64px.
Radius: inputs/botões 8px; cartões 12–14px; chips de logo 6px. Espaçamento base múltiplos de ~6–8px (gaps 6/10/12/16/26px).
Sombras: cartão mobile `0 30px 80px -24px rgba(0,0,0,0.75)`; botão primário `0 4px 14px rgba(94,106,210,0.30)`.

## Assets
Em `assets/`:
- `atrios_logo.png` — logo Átrios. **Original é escuro**; renderizado em branco com `filter: invert(1)` sobre fundo dark. Se a marca tiver versão monocromática branca oficial, prefira-a.
- `arpen_rn.png`, `anoreg_rn.png` — logos de parceria (placeholders reais fornecidos; confirmar autorização de uso). Exibir sobre chip claro por serem logos escuros.
Ícones: SVG inline stroke (lápis, telefone, documento, check, alerta) — substituir pela biblioteca de ícones do codebase.
OG image: exportar a tela 1e como PNG 1200×630.

## Files
- `Diagnóstico 213 - Landing pública.dc.html` — protótipo hi-fi com as 5 telas (1a–1e). Fonte de verdade para markup, estilos inline e copy.
- `assets/` — logos.

> Observação: o arquivo é um Design Component. Ao ler, foque no HTML + estilos inline dentro do template; a copy final é exatamente a que está no arquivo (travessões já removidos do texto voltado ao público).

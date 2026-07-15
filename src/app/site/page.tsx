import type { Metadata } from "next";
import Link from "next/link";
import { ContadorPrazos } from "@/components/landing/contador-prazos";
import { Rodape } from "@/components/landing/rodape";
import { Topo } from "@/components/landing/topo";
import { ETAPAS, ETAPAS_ESCOPO } from "@/lib/diagnostico/constants";
import { PRORROGACAO_MAX_DIAS } from "@/lib/diagnostico/motor";
import {
  CONTATO_EMAIL,
  siteUrl,
  WHATSAPP_EXIBICAO,
  WHATSAPP_NUMERO,
  whatsappUrl,
} from "@/lib/landing/config";
import { CLASSES, type Norma } from "@/lib/landing/norma";
import { carregarNorma } from "@/lib/landing/queries";

// Site institucional público — servido fora da autenticação (ver src/proxy.ts).
// Não capta lead por conta própria: todo CTA aponta para /diagnostico (que grava
// em Leads) ou para o WhatsApp. Um segundo canal quebraria o funil.
//
// Regra de conteúdo: nenhum número de cliente, case ou tempo de mercado. A prova
// social é (1) a experiência dos sócios e (2) o domínio demonstrado da norma —
// por isso a seção "Entenda a norma" é longa e precisa: é ela que prova
// competência, e é o principal conteúdo de SEO do site.

const META_TITLE =
  "Átrios — Adequação de cartórios ao Provimento CNJ 213/2026 no RN";
const META_DESC =
  "Consultoria especializada no Provimento CNJ 213/2026 para serventias do Rio Grande do Norte. Diagnóstico gratuito em 20 minutos, com relatório por escrito.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESC,
  alternates: { canonical: "/site" },
  keywords: [
    "Provimento 213 CNJ",
    "Provimento CNJ 213/2026",
    "cartórios Rio Grande do Norte",
    "adequação de serventias",
    "LGPD cartório",
    "segurança da informação cartório",
  ],
  // og:image / twitter:image vêm do arquivo opengraph-image.tsx (convention).
  openGraph: {
    title: META_TITLE,
    description: META_DESC,
    type: "website",
    locale: "pt_BR",
    url: "/site",
    siteName: "Átrios Tecnologia e Consultoria",
  },
  twitter: {
    card: "summary_large_image",
    title: META_TITLE,
    description: META_DESC,
  },
};

// Sem revalidação estática: o contador depende da data atual.
export const dynamic = "force-dynamic";

const WA_TEXTO =
  "Olá! Vim pelo site e quero falar sobre a adequação da minha serventia ao Provimento CNJ 213/2026.";

const brl = (v: number) =>
  v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

/* ---- Primitivos de layout ----------------------------------------------- */

const btnBase =
  "inline-flex h-12 items-center justify-center rounded-btn px-5 text-[14.5px] font-semibold transition-colors md:h-11";

function Secao({
  id,
  eyebrow,
  titulo,
  intro,
  children,
}: {
  id: string;
  eyebrow: string;
  titulo: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="flex flex-col gap-6 border-t border-line pt-12 md:pt-16"
    >
      <div className="flex max-w-[720px] flex-col gap-2.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-primary-ink">
          {eyebrow}
        </span>
        <h2 className="text-pretty text-[23px] font-bold leading-[1.25] tracking-[-0.02em] text-fg-hi md:text-[29px]">
          {titulo}
        </h2>
        {intro && (
          <p className="text-pretty text-[14.5px] leading-[1.6] text-fg-4 md:text-[15.5px]">
            {intro}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-field border border-line bg-surface-card p-4 md:p-5 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

/** Referência ao artigo — a fonte fica visível em cada afirmação sobre a norma. */
function Ref({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-medium uppercase tracking-[0.05em] text-fg-8">
      {children}
    </span>
  );
}

/* ---- 1. Hero ------------------------------------------------------------ */

function Hero() {
  return (
    <header className="flex flex-col gap-7">
      <Topo />
      <div className="flex max-w-[760px] flex-col gap-4">
        <span className="w-fit rounded-pill border border-[rgba(94,106,210,0.3)] bg-[rgba(94,106,210,0.1)] px-3 py-1 text-[11.5px] font-semibold uppercase tracking-[0.06em] text-primary-fg">
          Provimento CNJ 213/2026 · Rio Grande do Norte
        </span>
        {/* text-pretty, não text-balance: no mobile o balance quebra o título
            em 4 linhas curtas e desperdiça a largura da dobra. */}
        <h1 className="text-pretty text-[32px] font-bold leading-[1.14] tracking-[-0.025em] text-fg-hi md:text-balance md:text-[46px]">
          Adequação de cartórios ao Provimento CNJ&nbsp;213/2026
        </h1>
        <p className="text-pretty text-[16px] leading-[1.55] text-fg-3 md:text-[18px]">
          Consultoria e tecnologia para serventias extrajudiciais do RN, por uma
          equipe que conhece a rotina de dentro do cartório.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/diagnostico"
          className={`${btnBase} bg-primary text-white shadow-brand hover:bg-primary-hover`}
        >
          Diagnóstico gratuito
        </Link>
        <a
          href={whatsappUrl(WA_TEXTO)}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btnBase} border border-line-field-strong text-fg-3 hover:border-line-hover hover:text-fg-1`}
        >
          Falar no WhatsApp
        </a>
      </div>
    </header>
  );
}

/* ---- 2. O que é o Provimento 213 e por que urge -------------------------- */

function PorQueUrge({ norma }: { norma: Norma }) {
  return (
    <Secao
      id="o-que-e"
      eyebrow="O que mudou"
      titulo="O Provimento 213 já está em vigor — e o prazo corre desde a publicação"
      intro={
        <>
          O Provimento CNJ n. 213/2026 revogou o Provimento 74/2018 e redefiniu
          os padrões mínimos de tecnologia, segurança da informação e proteção
          de dados de todas as serventias extrajudiciais do país. Está em vigor
          desde{" "}
          <strong className="font-semibold text-fg-2">{norma.vigencia}</strong>,
          data da publicação no DJe/CNJ — é dela que os prazos são contados.
        </>
      }
    >
      <ContadorPrazos norma={norma} className="max-w-[620px]" />
      <p className="max-w-[720px] text-[13.5px] leading-[1.6] text-fg-5">
        A contagem acima já considera a prorrogação de {norma.prorrogacaoDias}{" "}
        dias concedida pela Corregedoria-Geral da Justiça do RN, que vale de
        ofício para todas as serventias do estado — nenhum cartório precisa
        requerer. Ela não dispensa obrigação nenhuma: durante o período
        adicional as serventias seguem obrigadas às medidas mitigatórias.
      </p>
    </Secao>
  );
}

/* ---- 3. Entenda a norma -------------------------------------------------- */

function Classes({ norma }: { norma: Norma }) {
  const faixa: Record<number, string> = {
    1: `Até ${brl(norma.tetoClasse1)}`,
    2: `De ${brl(norma.tetoClasse1)} a ${brl(norma.tetoClasse2)}`,
    3: `Acima de ${brl(norma.tetoClasse2)}`,
  };
  const inciso: Record<number, string> = {
    1: "art. 16, I",
    2: "art. 16, II",
    3: "art. 16, III",
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[15px] font-semibold text-fg-2">
        As 3 classes, por arrecadação semestral
      </h3>
      <div className="grid gap-3 md:grid-cols-3">
        {[1, 2, 3].map((c) => (
          <Card key={c}>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[15px] font-semibold text-fg-1">
                Classe {c}
              </span>
              <Ref>{inciso[c]}</Ref>
            </div>
            <span className="text-[15px] font-semibold tracking-[-0.01em] text-primary-fg">
              {faixa[c]}
            </span>
            <span className="text-[13px] leading-[1.5] text-fg-5">
              Prazo de {norma.porClasse[c].prazoArt20Dias} dias para as Etapas 1
              e 2 e de {norma.porClasse[c].prazoArt23Meses} meses para as cinco
              etapas.
            </span>
          </Card>
        ))}
      </div>
      <p className="max-w-[720px] text-[13px] leading-[1.6] text-fg-6">
        Os valores são de arrecadação por semestre e corrigidos anualmente pelo
        IPCA. O enquadramento é{" "}
        <strong className="font-semibold text-fg-4">
          declarado pela própria serventia
        </strong>{" "}
        (art. 16, §1º) — qualquer classe estimada por ferramenta, inclusive a
        nossa, é apenas indicativa.
      </p>
    </div>
  );
}

function Etapas() {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[15px] font-semibold text-fg-2">
        As 5 etapas do Anexo IV, na ordem
      </h3>
      <p className="max-w-[720px] text-[13px] leading-[1.6] text-fg-6">
        As etapas são sequenciais: cada uma só começa depois de concluída a
        anterior, e a conclusão é declarada no Sistema Justiça Aberta.
      </p>
      <ol className="flex flex-col gap-2">
        {[1, 2, 3, 4, 5].map((e) => (
          <li key={e}>
            <Card className="flex-row items-start gap-3.5 md:gap-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-[rgba(94,106,210,0.12)] text-[13.5px] font-bold text-primary-fg">
                {e}
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-[14.5px] font-semibold leading-[1.4] text-fg-1">
                  {ETAPAS[e]}
                </span>
                <span className="text-[13px] leading-[1.5] text-fg-5">
                  {ETAPAS_ESCOPO[e]}
                </span>
              </div>
            </Card>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Prazos({ norma }: { norma: Norma }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[15px] font-semibold text-fg-2">
        Os prazos, por classe
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left">
          <thead>
            <tr className="border-b border-line-strong">
              {[
                "Classe",
                "Etapas 1 e 2 (art. 20)",
                "Data-limite no RN",
                "Todas as etapas (art. 23)",
              ].map((h) => (
                <th
                  key={h}
                  className="py-2.5 pr-4 text-[11px] font-semibold uppercase tracking-[0.05em] text-fg-8"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CLASSES.map((c) => {
              const cl = norma.porClasse[c];
              return (
                <tr key={c} className="border-b border-line">
                  <td className="py-3 pr-4 text-[14px] font-semibold text-fg-1">
                    Classe {c}
                  </td>
                  <td className="py-3 pr-4 text-[14px] text-fg-4">
                    {cl.prazoArt20Dias} dias
                  </td>
                  <td className="py-3 pr-4 text-[14px] font-medium text-fg-2">
                    {cl.dataLimite}
                  </td>
                  <td className="py-3 pr-4 text-[14px] text-fg-4">
                    {cl.prazoArt23Meses} meses · até {cl.dataLimiteTotal}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="max-w-[720px] text-[13px] leading-[1.6] text-fg-6">
        Os prazos do art. 20 e do art. 23 correm da entrada em vigor (
        {norma.vigencia}). A coluna de data-limite já soma a prorrogação de{" "}
        {norma.prorrogacaoDias} dias do art. 21 aplicada ao RN.
      </p>
    </div>
  );
}

function Prorrogacao({ norma }: { norma: Norma }) {
  return (
    <Card className="max-w-[720px] gap-2.5 border-[rgba(94,106,210,0.22)] bg-[rgba(94,106,210,0.05)]">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[14.5px] font-semibold text-fg-1">
          A prorrogação do RN: {norma.prorrogacaoDias} dias, uma única vez
        </span>
        <Ref>art. 21</Ref>
      </div>
      <p className="text-[13.5px] leading-[1.6] text-fg-4">
        A Corregedoria-Geral da Justiça do RN prorrogou o prazo do art. 20 em{" "}
        {norma.prorrogacaoDias} dias. A prorrogação vale{" "}
        <strong className="font-semibold text-fg-2">de ofício</strong> para
        todas as serventias do estado — nenhum cartório precisa requerer — e é a{" "}
        <strong className="font-semibold text-fg-2">
          única que a norma admite
        </strong>
        : o art. 21 autoriza prorrogar &ldquo;uma única vez&rdquo;, por até{" "}
        {PRORROGACAO_MAX_DIAS} dias. Não haverá uma segunda.
      </p>
      <p className="text-[13px] leading-[1.6] text-fg-6">
        Ela também não dispensa obrigação alguma: durante o período adicional as
        serventias permanecem obrigadas às medidas mitigatórias.
      </p>
      {/* Fonte da decisão (processo, data, órgão) vem do próprio parametro_norma
          — a mesma linha que alimenta a contagem, então nunca diverge dela. */}
      {norma.prorrogacaoDescricao && (
        <p className="border-t border-line pt-2.5 text-[12px] leading-[1.55] text-fg-7">
          <span className="font-semibold text-fg-6">Fonte: </span>
          {norma.prorrogacaoDescricao}
        </p>
      )}
    </Card>
  );
}

function EntendaNorma({ norma }: { norma: Norma }) {
  return (
    <Secao
      id="entenda-a-norma"
      eyebrow="Entenda a norma"
      titulo="O que o Provimento 213 exige da sua serventia"
      intro="Classe por arrecadação, cinco etapas sequenciais e prazos distintos para cada uma. O resumo abaixo segue o texto oficial — cada afirmação traz o artigo, para você conferir."
    >
      <div className="flex flex-col gap-9">
        <Classes norma={norma} />
        <Etapas />
        <Prazos norma={norma} />
        <Prorrogacao norma={norma} />
      </div>
    </Secao>
  );
}

/* ---- 4. Diagnóstico gratuito --------------------------------------------- */

const PASSOS_DIAG = [
  {
    titulo: "Você se cadastra",
    texto: "Leva 1 minuto — só os dados de contato da serventia.",
  },
  {
    titulo: "Call de 20 minutos",
    texto: "Perguntas simples sobre a rotina do cartório, sem jargão técnico.",
  },
  {
    titulo: "Relatório por escrito",
    texto: "Sua classe, seus prazos e cada ponto de adequação, item a item.",
  },
];

/**
 * Prévia do relatório com os scores borrados: mostra o formato da entrega sem
 * entregá-la. Os números são de exemplo e ficam ilegíveis por construção —
 * nenhum deles é apresentado como resultado real de serventia alguma.
 */
function PreviewRelatorio() {
  return (
    <div className="relative overflow-hidden rounded-panel border border-line bg-surface-card p-5">
      <div className="flex flex-col gap-1 border-b border-line pb-3.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-8">
          Exemplo de relatório
        </span>
        <span className="text-[15px] font-semibold text-fg-1">
          Score por etapa
        </span>
      </div>
      <ul className="flex flex-col gap-3.5 pt-4" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((e, i) => (
          <li key={e} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[12.5px] font-medium text-fg-4">
                Etapa {e}
              </span>
              <span className="text-[12.5px] font-bold text-fg-2 blur-[5px] select-none">
                {[72, 48, 91, 35, 60][i]}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-pill bg-white/6">
              <div
                className="h-full rounded-pill bg-primary/55 blur-[3px]"
                style={{ width: `${[72, 48, 91, 35, 60][i]}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
      <p className="pt-4 text-[12px] leading-[1.5] text-fg-7">
        O relatório completo traz o score de cada etapa, os pontos em aberto por
        prioridade e o prazo da sua classe.
      </p>
    </div>
  );
}

function Diagnostico() {
  return (
    <Secao
      id="diagnostico"
      eyebrow="Por onde começar"
      titulo="Diagnóstico gratuito: onde sua serventia está hoje"
      intro="Uma conversa de 20 minutos e um relatório por escrito com o que já está cumprido e o que falta. Sem custo e sem compromisso."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,420px)] lg:items-start lg:gap-12">
        <div className="flex flex-col gap-4">
          {PASSOS_DIAG.map((p, i) => (
            <div key={p.titulo} className="flex items-start gap-3.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-[rgba(94,106,210,0.12)] text-[13.5px] font-bold text-primary-fg">
                {i + 1}
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-semibold text-fg-1">
                  {p.titulo}
                </span>
                <span className="text-[13.5px] leading-[1.5] text-fg-5">
                  {p.texto}
                </span>
              </div>
            </div>
          ))}
          <Link
            href="/diagnostico"
            className={`${btnBase} mt-2 w-fit bg-primary text-white shadow-brand hover:bg-primary-hover`}
          >
            Quero o diagnóstico gratuito
          </Link>
        </div>
        <PreviewRelatorio />
      </div>
    </Secao>
  );
}

/* ---- 5. Quem somos ------------------------------------------------------- */

function QuemSomos() {
  return (
    <Secao
      id="quem-somos"
      eyebrow="Quem somos"
      titulo="Uma equipe que já trabalhou do outro lado do balcão"
      intro="A Átrios Tecnologia e Consultoria nasceu do encontro entre quem entende de tecnologia e quem viveu a rotina de uma serventia extrajudicial por dentro."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="gap-2.5">
          <span className="text-[15px] font-semibold text-fg-1">
            Mais de 10 anos dentro de serventia extrajudicial
          </span>
          <p className="text-[13.5px] leading-[1.6] text-fg-4">
            Nossa equipe conhece a prática interna de cartório: como o ato
            funciona de verdade, quais documentos cada um exige, como o balcão
            atende e o que a Corregedoria efetivamente olha numa correição. É o
            que nenhuma consultoria de TI consegue replicar — e é o que faz a
            diferença entre um checklist genérico e uma adequação que sobrevive
            à fiscalização.
          </p>
        </Card>
        <Card className="gap-2.5">
          <span className="text-[15px] font-semibold text-fg-1">
            Especialistas na norma, não em TI genérica
          </span>
          <p className="text-[13.5px] leading-[1.6] text-fg-4">
            Trabalhamos exclusivamente com o Provimento 213 e com o que ele
            exige: segurança da informação, LGPD e continuidade aplicadas ao
            contexto extrajudicial. Não vendemos pacote de TI avulso — vendemos
            conformidade documentada, na linguagem que a Corregedoria cobra.
          </p>
        </Card>
      </div>
    </Secao>
  );
}

/* ---- 6. O que fazemos ---------------------------------------------------- */

const SERVICOS = [
  {
    titulo: "Adequação ao Provimento 213",
    escopo: "Etapas 1 e 2",
    texto:
      "As obrigações do art. 20: responsáveis designados, Política de Segurança da Informação, acessos individualizados com MFA, registro de tratamento de dados (ROPA), procedimento de incidentes, inventário de ativos e a estrutura física mínima. Entregamos os documentos prontos e a declaração no Justiça Aberta.",
  },
  {
    titulo: "Acompanhamento contínuo",
    escopo: "Etapas 3 a 5 e DPO as a Service",
    texto:
      "Backup e proteção de dados, testes de restauração com ata, integração e manutenção ao longo do tempo — o que o art. 23 cobra até o fim do ciclo. Inclui o Encarregado de Proteção de Dados como serviço, com os papéis separados para evitar conflito de interesse.",
  },
  {
    titulo: "Identidade digital para serventias",
    escopo: "Presença institucional",
    texto:
      "Site da serventia com o canal de atendimento ao titular exigido pela LGPD, e-mail corporativo no domínio próprio e WhatsApp corporativo. A serventia deixa de depender de e-mail pessoal e passa a ter canal de contato rastreável.",
  },
];

function OQueFazemos() {
  return (
    <Secao
      id="o-que-fazemos"
      eyebrow="O que fazemos"
      titulo="Três frentes, todas ligadas à norma"
      intro="Nada de serviço de TI avulso. Cada frente existe porque o Provimento 213 exige — ou porque a serventia precisa dela para operar em conformidade."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {SERVICOS.map((s) => (
          <Card key={s.titulo} className="gap-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-primary-ink">
              {s.escopo}
            </span>
            <span className="text-[15.5px] font-semibold leading-[1.35] text-fg-1">
              {s.titulo}
            </span>
            <p className="text-[13.5px] leading-[1.6] text-fg-5">{s.texto}</p>
          </Card>
        ))}
      </div>
    </Secao>
  );
}

/* ---- 7. CTA final + contato ---------------------------------------------- */

function CtaFinal({ norma }: { norma: Norma }) {
  return (
    <section
      id="contato"
      className="flex flex-col items-start gap-5 rounded-panel border border-line-strong bg-surface-card p-6 md:p-9"
    >
      <div className="flex max-w-[640px] flex-col gap-2.5">
        <h2 className="text-balance text-[24px] font-bold leading-[1.2] tracking-[-0.02em] text-fg-hi md:text-[30px]">
          A Classe 3 tem {norma.porClasse[3].diasRestantes} dias. Comece pelo
          diagnóstico.
        </h2>
        <p className="text-pretty text-[14.5px] leading-[1.6] text-fg-4 md:text-[15.5px]">
          Em 20 minutos você sai sabendo em que classe sua serventia se
          enquadra, qual é o seu prazo real e o que falta cumprir. Sem custo.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/diagnostico"
          className={`${btnBase} bg-primary text-white shadow-brand hover:bg-primary-hover`}
        >
          Diagnóstico gratuito
        </Link>
        <a
          href={whatsappUrl(WA_TEXTO)}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btnBase} border border-line-field-strong text-fg-3 hover:border-line-hover hover:text-fg-1`}
        >
          Falar no WhatsApp
        </a>
      </div>
      <span className="text-[13px] text-fg-6">
        Ou fale direto:{" "}
        <a
          href={`mailto:${CONTATO_EMAIL}`}
          className="text-primary-ink no-underline hover:text-primary-fg"
        >
          {CONTATO_EMAIL}
        </a>{" "}
        · {WHATSAPP_EXIBICAO}
      </span>
    </section>
  );
}

/* ---- Dados estruturados -------------------------------------------------- */

function JsonLd() {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Átrios Tecnologia e Consultoria",
    description: META_DESC,
    url: siteUrl(),
    logo: `${siteUrl()}/landing/atrios-logo.png`,
    email: CONTATO_EMAIL,
    telephone: `+${WHATSAPP_NUMERO}`,
    areaServed: {
      "@type": "State",
      name: "Rio Grande do Norte",
      addressCountry: "BR",
    },
    address: {
      "@type": "PostalAddress",
      addressRegion: "RN",
      addressCountry: "BR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: CONTATO_EMAIL,
      telephone: `+${WHATSAPP_NUMERO}`,
      availableLanguage: "Portuguese",
    },
  };
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD estático, serializado de objeto próprio — sem entrada de usuário
      dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
    />
  );
}

/* ---- Página -------------------------------------------------------------- */

export default async function HomePage() {
  const norma = await carregarNorma();

  return (
    <main
      className="min-h-dvh w-full px-5 py-10 md:px-10 md:py-14"
      style={{
        background:
          "radial-gradient(120% 90% at 30% -10%, #0d1018 0%, #06070a 55%, #050506 100%)",
      }}
    >
      <JsonLd />
      <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-12 md:gap-16">
        <Hero />
        <PorQueUrge norma={norma} />
        <EntendaNorma norma={norma} />
        <Diagnostico />
        <QuemSomos />
        <OQueFazemos />
        <CtaFinal norma={norma} />
        <Rodape />
      </div>
    </main>
  );
}

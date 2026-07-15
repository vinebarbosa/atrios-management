import type { Metadata } from "next";
import { ContadorPrazos } from "@/components/landing/contador-prazos";
import { Rodape } from "@/components/landing/rodape";
import { Topo } from "@/components/landing/topo";
import { carregarNorma } from "@/lib/landing/queries";
import { LandingForm } from "./landing-form";

// Landing pública — servida fora da autenticação (ver src/proxy.ts). O envio do
// formulário vira um lead "novo" no funil do módulo de diagnóstico.

const META_TITLE = "Diagnóstico gratuito — Provimento CNJ 213/2026";
const META_DESC =
  "Descubra o que sua serventia já cumpre e o que falta. 20 minutos, com relatório.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESC,
  // og:image / twitter:image vêm do arquivo opengraph-image.tsx (convention).
  openGraph: {
    title: META_TITLE,
    description: META_DESC,
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: META_TITLE,
    description: META_DESC,
  },
};

// A landing só renderiza no servidor/na carga — sem revalidação estática, pois
// o contador depende da data atual.
export const dynamic = "force-dynamic";

const PASSOS = [
  {
    titulo: "1. Você se cadastra",
    texto: "Leva 1 minuto, só os dados ao lado.",
    icone: (
      <path
        d="M11.3 2.4l2.3 2.3L5.4 12.9l-3 .7.7-3z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    titulo: "2. Call de 20 minutos",
    texto: "Perguntas simples sobre a rotina do cartório, sem jargão técnico.",
    icone: (
      <path
        d="M14.5 11.4v1.8a1.2 1.2 0 0 1-1.3 1.2 12.4 12.4 0 0 1-5.4-1.9 12.2 12.2 0 0 1-3.8-3.8A12.4 12.4 0 0 1 2.1 3.3 1.2 1.2 0 0 1 3.3 2h1.8a1.2 1.2 0 0 1 1.2 1c.1.6.2 1.2.5 1.8a1.2 1.2 0 0 1-.3 1.3l-.8.8a9.7 9.7 0 0 0 3.6 3.6l.8-.8a1.2 1.2 0 0 1 1.3-.3c.6.2 1.2.4 1.8.5a1.2 1.2 0 0 1 1 1.2z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    titulo: "3. Relatório por escrito",
    texto: "Sua classe, seus prazos e cada ponto de adequação.",
    icone: (
      <>
        <path
          d="M9.5 1.5H4.3A1.3 1.3 0 0 0 3 2.8v10.4a1.3 1.3 0 0 0 1.3 1.3h7.4a1.3 1.3 0 0 0 1.3-1.3V5z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.5 1.5V5H13M6 8.5h4M6 11h4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
  },
];

function ComoFunciona() {
  return (
    <div className="flex max-w-[560px] flex-col gap-3.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-9">
        Como funciona
      </span>
      {PASSOS.map((p) => (
        <div key={p.titulo} className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-[9px] bg-[rgba(94,106,210,0.12)]">
            <svg
              width="17"
              height="17"
              viewBox="0 0 16 16"
              fill="none"
              stroke="#a9b0ec"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              {p.icone}
            </svg>
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="text-[14.5px] font-semibold text-fg-2">
              {p.titulo}
            </span>
            <span className="text-[13px] leading-[1.5] text-fg-6">
              {p.texto}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function DiagnosticoLandingPage() {
  const norma = await carregarNorma();

  return (
    <main
      className="min-h-dvh w-full px-5 py-10 md:px-10 md:py-14"
      style={{
        background:
          "radial-gradient(120% 90% at 30% -10%, #0d1018 0%, #06070a 55%, #050506 100%)",
      }}
    >
      {/*
        Ordem mobile (DOM): hero+urgência → formulário → como funciona+rodapé.
        No desktop vira duas colunas: grupos A/B empilhados à esquerda (col 1,
        linhas 1 e 2) e o formulário centralizado à direita (col 2, span 2).
        As linhas são dimensionadas pelo conteúdo da coluna 1 — sem esticar.
      */}
      <div className="mx-auto grid w-full max-w-[1200px] gap-8 lg:grid-cols-[1fr_minmax(0,520px)] lg:items-start lg:gap-x-14 lg:gap-y-9">
        <div className="flex flex-col gap-7 lg:col-start-1 lg:row-start-1">
          <Topo comoLink />
          <div className="flex flex-col gap-2.5">
            <h1 className="text-pretty text-[27px] font-bold leading-[1.22] tracking-[-0.02em] text-fg-hi md:text-[33px]">
              Diagnóstico gratuito do Provimento CNJ 213/2026
            </h1>
            <p className="text-pretty text-[15px] leading-[1.55] text-fg-4 md:text-base">
              Descubra em uma conversa de 20 minutos o que a sua serventia já
              cumpre e o que ainda falta, com relatório por escrito.
            </p>
          </div>
          <ContadorPrazos norma={norma} className="max-w-[560px]" />
        </div>

        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
          <LandingForm />
        </div>

        <div className="flex flex-col gap-7 lg:col-start-1 lg:row-start-2">
          <ComoFunciona />
          <Rodape className="max-w-[560px]">
            <p className="text-[13px] leading-[1.55] text-fg-4">
              Nossa equipe conhece a prática interna de cartório: profissionais
              com mais de 10 anos de atuação em serventias extrajudiciais.
            </p>
          </Rodape>
        </div>
      </div>
    </main>
  );
}

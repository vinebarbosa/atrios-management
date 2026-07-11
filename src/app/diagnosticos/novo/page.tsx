import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";
import { NovoDiagnosticoForm } from "./novo-diagnostico-form";

export default function NovoDiagnosticoPage() {
  return (
    <>
      <header className="flex h-[53px] shrink-0 items-center gap-[9px] border-b border-line px-5">
        <Link
          href="/diagnosticos"
          className="flex items-center gap-1.5 text-xs text-fg-6 transition-colors duration-200 hover:text-fg-2"
        >
          <ArrowLeftIcon />
          Diagnósticos
        </Link>
        <span className="text-fg-9">/</span>
        <span className="text-sm font-semibold text-fg-1">
          Novo diagnóstico
        </span>
      </header>
      <div className="flex-1 overflow-auto p-5">
        <div className="mx-auto max-w-[620px]">
          <p className="mb-4 text-[12.5px] leading-relaxed text-fg-7">
            Identificação da serventia para o roteiro de call (~20 minutos). O
            escopo padrão cobre as Etapas 1 e 2 — as obrigatórias do art. 20 — e
            as perguntas de identidade digital.
          </p>
          <NovoDiagnosticoForm />
        </div>
      </div>
    </>
  );
}

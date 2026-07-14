"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui";
import { vincularServentia } from "../actions";

export interface ServentiaOpcao {
  cns: string;
  nome: string;
  situacao: string;
}

// Vínculo manual do lead → serventia, filtrado pelo município (2–5 opções).
// Um clique persiste o CNS; "Criar diagnóstico" abre o formulário pré-preenchido
// com os dados da serventia.
export function VincularServentia({
  leadId,
  cnsAtual,
  opcoes,
}: {
  leadId: string;
  cnsAtual: string | null;
  opcoes: ServentiaOpcao[];
}) {
  const router = useRouter();
  const [cns, setCns] = useState(cnsAtual ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (opcoes.length === 0) {
    return (
      <span className="text-[12px] text-fg-9">Sem serventia no município</span>
    );
  }

  const vincular = (novo: string) => {
    setCns(novo);
    setError(null);
    if (!novo) return;
    startTransition(async () => {
      const r = await vincularServentia(leadId, novo);
      if (r.error) {
        setError(r.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        aria-label="Vincular à serventia"
        className="h-[30px] max-w-[220px] cursor-pointer rounded-btn border border-line-field bg-surface-1 px-2 text-[12.5px] text-fg-3 outline-none transition-colors duration-200 focus:border-primary/40 disabled:opacity-50"
        value={cns}
        onChange={(e) => vincular(e.target.value)}
        disabled={pending}
      >
        <option value="">Vincular…</option>
        {opcoes.map((o) => (
          <option key={o.cns} value={o.cns}>
            {o.nome}
            {o.situacao && o.situacao !== "PROVIDO" ? " (vaga)" : ""}
          </option>
        ))}
      </select>
      {cns && (
        <Link href={`/diagnosticos/novo?cns=${cns}`}>
          <Button size="sm">Criar diagnóstico</Button>
        </Link>
      )}
      {error && <span className="text-[11px] text-danger">{error}</span>}
    </div>
  );
}

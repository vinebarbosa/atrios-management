"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ChainLinkOffIcon } from "@/components/icons";
import { Button, IconButton } from "@/components/ui";
import { vincularServentia } from "../actions";

export interface ServentiaOpcao {
  cns: string;
  nome: string;
  situacao: string;
}

// Vínculo manual do lead → serventia, filtrado pelo município (2–5 opções).
// Um clique persiste o CNS; "Criar diagnóstico" abre o formulário pré-preenchido
// com os dados da serventia. Como o select grava na hora, escolher a serventia
// errada precisa de saída: daí o botão de desvincular — voltar o select pra
// "Vincular…" não desfazia nada, só limpava a tela até o próximo refresh.
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

  // `novo` vazio = opção "Vincular…", que aqui significa desvincular.
  const vincular = (novo: string) => {
    setCns(novo);
    setError(null);
    startTransition(async () => {
      const r = await vincularServentia(leadId, novo || null);
      if (r.error) {
        setError(r.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    // nowrap: com wrap, o "Criar diagnóstico" caía pra segunda linha e dobrava
    // a altura da linha da tabela. Sem ele, a coluna pede a largura que precisa.
    <div className="flex items-center gap-2 whitespace-nowrap">
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
        <>
          <IconButton
            size={24}
            aria-label="Desvincular da serventia"
            title="Desvincular da serventia"
            onClick={() => vincular("")}
            disabled={pending}
          >
            <ChainLinkOffIcon size={13} />
          </IconButton>
          <Link href={`/diagnosticos/novo?cns=${cns}`}>
            <Button size="sm">Criar diagnóstico</Button>
          </Link>
        </>
      )}
      {error && <span className="text-[11px] text-danger">{error}</span>}
    </div>
  );
}

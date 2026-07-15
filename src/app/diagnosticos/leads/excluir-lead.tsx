"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { TrashIcon } from "@/components/icons";
import { IconButton } from "@/components/ui";
import { deleteDiagnostico } from "../actions";

// Descarta um lead do pré-cadastro público (spam, teste, duplicata). Exclusão
// de verdade, não arquivamento: o lead ainda não virou diagnóstico, então não
// há resposta nem histórico a preservar. Confirmação via window.confirm, como
// no resto do módulo (ver relatorio-acoes.tsx).
export function ExcluirLead({
  leadId,
  serventia,
}: {
  leadId: string;
  serventia: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const excluir = () => {
    if (!window.confirm(`Excluir o lead de "${serventia}"?`)) return;
    startTransition(async () => {
      const r = await deleteDiagnostico(leadId);
      if (r.error) {
        setError(r.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {error && <span className="text-[11px] text-danger">{error}</span>}
      <IconButton
        size={24}
        aria-label={`Excluir o lead de ${serventia}`}
        title="Excluir lead"
        onClick={excluir}
        disabled={pending}
        className="hover:text-danger"
      >
        <TrashIcon size={13} />
      </IconButton>
    </div>
  );
}

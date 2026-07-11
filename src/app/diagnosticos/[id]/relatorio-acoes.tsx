"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui";
import { deleteDiagnostico, reabrirDiagnostico } from "../actions";

export function RelatorioAcoes({
  diagnosticoId,
  serventia,
}: {
  diagnosticoId: string;
  serventia: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const reabrir = () => {
    startTransition(async () => {
      const result = await reabrirDiagnostico(diagnosticoId);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  };

  const excluir = () => {
    if (
      !window.confirm(
        `Excluir o diagnóstico de "${serventia}"? As respostas serão perdidas.`,
      )
    )
      return;
    startTransition(async () => {
      const result = await deleteDiagnostico(diagnosticoId);
      if (result.error) setError(result.error);
      else router.push("/diagnosticos");
    });
  };

  return (
    <div className="flex items-center gap-[9px]">
      {error && <span className="text-[11.5px] text-danger">{error}</span>}
      <Button variant="ghost" onClick={excluir} disabled={pending}>
        Excluir
      </Button>
      <Button variant="secondary" onClick={reabrir} disabled={pending}>
        Reabrir
      </Button>
      <a href={`/diagnosticos/${diagnosticoId}/pdf`} download>
        <Button disabled={pending}>Baixar PDF</Button>
      </a>
    </div>
  );
}

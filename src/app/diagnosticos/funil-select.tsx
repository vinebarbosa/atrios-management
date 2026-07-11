"use client";

import { useState, useTransition } from "react";
import type { DiagnosticoStatusFunil } from "@/db/schema";
import { STATUS_FUNIL } from "@/lib/diagnostico/constants";
import { setStatusFunil } from "./actions";

/** Select inline de status do funil (só para diagnósticos concluídos). */
export function FunilSelect({
  diagnosticoId,
  status,
}: {
  diagnosticoId: string;
  status: DiagnosticoStatusFunil;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const color =
    STATUS_FUNIL.find((s) => s.value === status)?.color ?? "#8a8f98";

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="size-1.5 shrink-0 rounded-full"
        style={{ background: color }}
      />
      <select
        aria-label="Status do funil"
        className="h-6 cursor-pointer rounded-btn border border-transparent bg-transparent pr-1 text-[12px] text-fg-3 outline-none transition-colors duration-200 hover:border-line-field focus:border-primary/40 disabled:cursor-default"
        value={status}
        disabled={pending}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          const value = e.target.value as DiagnosticoStatusFunil;
          startTransition(async () => {
            const result = await setStatusFunil(diagnosticoId, value);
            setError(result.error ?? null);
          });
        }}
      >
        {STATUS_FUNIL.filter((s) => s.value !== "em_andamento").map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      {error && <span className="text-[11px] text-danger">{error}</span>}
    </span>
  );
}

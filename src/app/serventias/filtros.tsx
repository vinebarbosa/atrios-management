"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const selectClass =
  "h-[30px] cursor-pointer rounded-btn border border-line-field bg-surface-1 px-2 text-[12.5px] text-fg-3 outline-none transition-colors duration-200 focus:border-primary/40";

export function Filtros() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const set = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const val = (key: string) => searchParams.get(key) ?? "";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        aria-label="Filtrar por classe estimada"
        className={selectClass}
        value={val("classe")}
        onChange={(e) => set("classe", e.target.value)}
      >
        <option value="">Classe — todas</option>
        <option value="1">Classe 1</option>
        <option value="2">Classe 2</option>
        <option value="3">Classe 3</option>
      </select>
      <select
        aria-label="Filtrar por situação"
        className={selectClass}
        value={val("situacao")}
        onChange={(e) => set("situacao", e.target.value)}
      >
        <option value="">Situação — todas</option>
        <option value="vaga">Vaga / interina</option>
        <option value="provida">Provida</option>
      </select>
      <select
        aria-label="Filtrar por diagnóstico"
        className={selectClass}
        value={val("diag")}
        onChange={(e) => set("diag", e.target.value)}
      >
        <option value="">Diagnóstico — todos</option>
        <option value="sem">Sem diagnóstico</option>
        <option value="com">Com diagnóstico</option>
      </select>
    </div>
  );
}

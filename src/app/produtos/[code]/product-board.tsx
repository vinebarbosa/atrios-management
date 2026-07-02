"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  CloseIcon,
  CopyIcon,
  ExternalIcon,
  GitGraphIcon,
  KanbanIcon,
  ListIcon,
  PlusIcon,
} from "@/components/icons";
import {
  Badge,
  Button,
  IconButton,
  RepoChip,
  SegmentedControl,
  StatusPill,
  Stepper,
  TaskCard,
} from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  boardFor,
  type Card,
  type Column,
  type Product,
  REPO_COLORS,
  type RepoKey,
  STAGES,
} from "@/lib/mock-data";

const CONTEXT_KEY = "atrios.productContextOpen";
const STOPWORDS = new Set([
  "de",
  "do",
  "da",
  "dos",
  "das",
  "no",
  "na",
  "em",
  "o",
  "a",
  "e",
]);

function suggestBranch(card: Card): string {
  const words = card.title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w && !STOPWORDS.has(w))
    .slice(0, 2);
  return [card.id.toLowerCase(), ...words].join("-");
}

function nextCardId(code: string, columns: Column[]): string {
  const max = columns
    .flatMap((c) => c.cards)
    .reduce((m, c) => Math.max(m, Number(c.id.split("-")[1]) || 0), 0);
  return `${code}-${max + 1}`;
}

export function ProductBoard({ product }: { product: Product }) {
  const stage = STAGES[product.stageIndex];
  const [contextOpen, setContextOpen] = useState(true);
  const [view, setView] = useState("kanban");
  const [columns, setColumns] = useState<Column[]>(() =>
    boardFor(product.code),
  );
  const [composing, setComposing] = useState(false);
  const [selected, setSelected] = useState<Card | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(CONTEXT_KEY);
    if (saved !== null) setContextOpen(saved === "1");
  }, []);

  const toggleContext = () => {
    const next = !contextOpen;
    setContextOpen(next);
    localStorage.setItem(CONTEXT_KEY, next ? "1" : "0");
  };

  const createCard = (title: string, repo?: RepoKey) => {
    setColumns((cols) =>
      cols.map((c) =>
        c.key === "todo"
          ? {
              ...c,
              cards: [
                {
                  id: nextCardId(product.code, cols),
                  title,
                  repo,
                  isNew: true,
                },
                ...c.cards,
              ],
            }
          : c,
      ),
    );
    setComposing(false);
  };

  const columnOf = (card: Card) =>
    columns.find((c) => c.cards.some((x) => x.id === card.id)) ?? columns[0];

  return (
    <>
      {/* breadcrumb */}
      <div className="flex h-11 shrink-0 items-center gap-2 border-b border-line-subtle px-[22px]">
        <span className="text-[12.5px] text-fg-6">Produtos</span>
        <span className="text-fg-9">
          <ChevronRightIcon />
        </span>
        <span className="text-[12.5px] text-fg-5">{product.name}</span>
      </div>

      {/* product header */}
      <div className="shrink-0 border-b border-line-subtle px-[22px] pb-[18px] pt-[22px]">
        <div className="flex items-center gap-[13px]">
          <span
            className="size-[11px] shrink-0 rounded-full"
            style={{
              background: product.color,
              boxShadow: `0 0 12px ${product.color}88`,
            }}
          />
          <h1 className="text-[25px] font-semibold tracking-[-0.02em] text-fg-hi">
            {product.name}
          </h1>
          <span className="rounded-nav border border-line-strong bg-white/[0.06] px-[9px] py-0.5 font-mono text-xs font-semibold tracking-[0.04em] text-fg-4">
            {product.code}
          </span>
          <StatusPill hue={stage.hue}>{stage.name}</StatusPill>
          <div className="ml-auto" />
          <Button variant="secondary" size="md" onClick={toggleContext}>
            Contexto
            <span
              className="transition-transform duration-200"
              style={{ transform: contextOpen ? "none" : "rotate(-90deg)" }}
            >
              <ChevronDownIcon />
            </span>
          </Button>
        </div>
      </div>

      {/* collapsible context panel */}
      {contextOpen && (
        <div className="flex shrink-0 flex-col gap-[22px] border-b border-line-subtle bg-linear-to-b from-white/[0.014] to-transparent px-[22px] pb-[22px] pt-5">
          <div className="flex flex-wrap gap-10">
            <div className="min-w-[320px] flex-1">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-fg-8">
                Descrição
              </div>
              <p className="max-w-[560px] text-[13.5px] leading-relaxed text-fg-4">
                {product.longDesc ?? product.desc}
              </p>
            </div>
            <div className="min-w-[240px]">
              <div className="mb-[9px] text-[11px] font-semibold uppercase tracking-[0.05em] text-fg-8">
                Repositórios
              </div>
              {product.repos.length > 0 ? (
                <div className="flex flex-col gap-[7px]">
                  {product.repos.map((r) => (
                    <a
                      key={r.name}
                      href={`https://github.com/atrios/${r.name}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-[34px] items-center gap-[9px] rounded-field border border-[rgba(255,255,255,0.09)] bg-surface-1 px-[11px] transition-colors duration-200 hover:border-line-hover hover:bg-[#0e0f12]"
                    >
                      <span
                        className="size-[7px] shrink-0 rounded-full"
                        style={{ background: r.color }}
                      />
                      <span className="font-mono text-[12.5px] text-fg-2">
                        <span className="text-fg-8">atrios/</span>
                        {r.name}
                      </span>
                      <span className="ml-auto shrink-0 text-fg-7">
                        <ExternalIcon />
                      </span>
                    </a>
                  ))}
                </div>
              ) : (
                <Button
                  variant="dashed"
                  size="lg"
                  icon={<PlusIcon size={12} />}
                >
                  Adicionar repositório
                </Button>
              )}
            </div>
          </div>
          <div>
            <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.05em] text-fg-8">
              Etapa
            </div>
            <Stepper steps={STAGES} current={product.stageIndex} />
          </div>
        </div>
      )}

      {/* board */}
      <div className="flex min-h-0 flex-1 flex-col gap-3.5 px-5 pb-5 pt-4">
        <div className="flex shrink-0 items-center">
          <SegmentedControl
            value={view}
            onChange={setView}
            options={[
              { value: "kanban", label: "Kanban", icon: <KanbanIcon /> },
              { value: "list", label: "Lista", icon: <ListIcon /> },
            ]}
          />
        </div>

        {view === "kanban" ? (
          <div className="flex min-h-0 flex-1 gap-3.5">
            {columns.map((col) => (
              <div
                key={col.key}
                className="flex min-w-0 flex-1 flex-col gap-[11px]"
              >
                <div className="flex shrink-0 items-center gap-2 px-[3px]">
                  <span
                    className="size-[9px] shrink-0 rounded-full"
                    style={{ background: col.color }}
                  />
                  <span className="whitespace-nowrap text-[13px] font-semibold text-fg-3">
                    {col.title}
                  </span>
                  <span className="text-xs text-fg-9">
                    {col.total ?? col.cards.length}
                  </span>
                  {col.key === "todo" && (
                    <IconButton
                      aria-label="Novo card"
                      size={22}
                      className="ml-auto"
                      onClick={() => setComposing(true)}
                    >
                      <PlusIcon size={14} />
                    </IconButton>
                  )}
                </div>
                <div className="flex flex-col gap-2 overflow-auto">
                  {col.key === "todo" && composing && (
                    <CardComposer
                      nextId={nextCardId(product.code, columns)}
                      onCreate={createCard}
                      onCancel={() => setComposing(false)}
                    />
                  )}
                  {col.cards.map((card) => (
                    <TaskCard
                      key={card.id}
                      id={card.id}
                      title={card.title}
                      repo={card.repo}
                      prNum={card.pr}
                      auto={card.auto}
                      isNew={card.isNew}
                      className={cn(
                        "cursor-pointer",
                        card.isNew &&
                          "border-primary/40 bg-surface-selected shadow-glow-new",
                      )}
                      onClick={() => setSelected(card)}
                    />
                  ))}
                  {col.key === "todo" && !composing && (
                    <button
                      type="button"
                      onClick={() => setComposing(true)}
                      className="flex cursor-pointer items-center gap-1.5 rounded-field border border-dashed border-white/10 bg-transparent px-[11px] py-2 text-left text-[12.5px] text-fg-7 transition-colors duration-200 hover:border-primary/45 hover:text-primary-fg"
                    >
                      <PlusIcon size={12} />
                      Novo card
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-auto rounded-[10px] border border-[rgba(255,255,255,0.07)] bg-surface-1">
            {columns.map((col) => (
              <div key={col.key}>
                <div className="flex items-center gap-[9px] border-b border-line-subtle bg-surface-4 px-4 py-[9px]">
                  <span className="text-fg-7">
                    <ChevronDownIcon size={12} />
                  </span>
                  <span
                    className="size-[9px] shrink-0 rounded-full"
                    style={{ background: col.color }}
                  />
                  <span className="text-[12.5px] font-semibold text-fg-3">
                    {col.title}
                  </span>
                  <span className="rounded-pill bg-white/[0.06] px-[7px] text-[11px] font-semibold text-fg-6">
                    {col.total ?? col.cards.length}
                  </span>
                  {col.key === "todo" && (
                    <IconButton
                      aria-label="Novo card"
                      size={22}
                      className="ml-auto"
                      onClick={() => {
                        setView("kanban");
                        setComposing(true);
                      }}
                    >
                      <PlusIcon size={13} />
                    </IconButton>
                  )}
                </div>
                {col.cards.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setSelected(card)}
                    className="flex w-full cursor-pointer items-center gap-3 border-b border-line-subtle py-2.5 pl-[18px] pr-4 text-left transition-colors duration-200 hover:bg-white/[0.022]"
                  >
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ background: col.color }}
                    />
                    <span className="min-w-[58px] shrink-0 font-mono text-[11.5px] text-fg-7">
                      {card.id}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[13px] text-fg-2">
                      {card.title}
                    </span>
                    {card.auto && (
                      <Badge
                        tone="primary"
                        pulse
                        icon={<GitGraphIcon size={9} />}
                      >
                        auto
                      </Badge>
                    )}
                    {card.repo && <RepoChip name={card.repo} />}
                    {card.pr && (
                      <Badge tone="neutral" mono icon={<GitGraphIcon />}>
                        #{card.pr}
                      </Badge>
                    )}
                  </button>
                ))}
                {col.key === "todo" && (
                  <button
                    type="button"
                    onClick={() => {
                      setView("kanban");
                      setComposing(true);
                    }}
                    className="flex w-full cursor-pointer items-center gap-2 border-b border-line-subtle py-[9px] pl-[18px] pr-4 text-left text-[12.5px] text-fg-7 transition-colors duration-200 hover:bg-white/[0.015] hover:text-primary-fg"
                  >
                    <PlusIcon size={12} />
                    Novo card
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <CardPanel
          card={selected}
          column={columnOf(selected)}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

/* ---- Card composer (screen 05) ---------------------------------------- */

function CardComposer({
  nextId,
  onCreate,
  onCancel,
}: {
  nextId: string;
  onCreate: (title: string, repo?: RepoKey) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [repo, setRepo] = useState<RepoKey | "">("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => inputRef.current?.focus(), []);

  const submit = () => {
    if (title.trim()) onCreate(title.trim(), repo || undefined);
  };

  return (
    <div className="flex flex-col gap-[11px] rounded-field border border-primary/60 bg-surface-selected p-[11px] [box-shadow:0_0_0_3px_rgba(94,106,210,0.13)]">
      <input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") onCancel();
        }}
        placeholder="Título do card"
        className="w-full bg-transparent text-[13.5px] leading-[1.4] text-[#ececed] outline-none placeholder:text-fg-8"
      />
      <div className="flex items-center gap-2">
        <select
          aria-label="Repositório"
          value={repo}
          onChange={(e) => setRepo(e.target.value as RepoKey | "")}
          className="h-[27px] cursor-pointer rounded-nav border border-line-field-strong bg-surface-1 px-[9px] text-xs text-fg-3 outline-none"
        >
          <option value="">sem repo</option>
          {(Object.keys(REPO_COLORS) as RepoKey[]).map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <span className="ml-auto font-mono text-[11px] text-fg-9">
          {nextId}
        </span>
      </div>
      <div className="flex items-center gap-2 border-t border-[rgba(255,255,255,0.07)] pt-2.5">
        <span className="text-[11px] text-fg-9">Enter cria · Esc cancela</span>
        <div className="ml-auto flex gap-[7px]">
          <Button variant="secondary" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
          <Button size="sm" onClick={submit}>
            Criar
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---- Card panel (screen 06) -------------------------------------------- */

function CardPanel({
  card,
  column,
  onClose,
}: {
  card: Card;
  column: Column;
  onClose: () => void;
}) {
  const branch = suggestBranch(card);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        aria-label="Fechar"
        className="absolute inset-0 cursor-default bg-[rgba(4,5,7,0.55)]"
        onClick={onClose}
      />
      <div
        className="relative w-[720px] max-w-[92vw] overflow-hidden rounded-panel border border-white/10 bg-surface-card shadow-modal"
        role="dialog"
        aria-label={card.id}
      >
        <div className="flex items-center gap-2.5 border-b border-line px-[18px] py-3.5">
          <span className="rounded-chip bg-white/5 px-[7px] py-0.5 font-mono text-xs text-fg-6">
            {card.id}
          </span>
          <StatusPill hue={column.hue} tinted={false}>
            {column.title}
          </StatusPill>
          <div className="ml-auto" />
          <IconButton aria-label="Fechar" onClick={onClose}>
            <CloseIcon size={16} />
          </IconButton>
        </div>
        <div className="flex">
          <div className="min-w-0 flex-1 border-r border-line px-5 py-[22px]">
            <div className="mb-[18px] text-[19px] font-semibold leading-[1.3] tracking-[-0.01em] text-fg-hi">
              {card.title}
            </div>
            <div className="mb-[9px] text-[11px] font-semibold uppercase tracking-[0.05em] text-fg-8">
              Descrição
            </div>
            <p className="text-[13.5px] leading-[1.65] text-fg-4">
              {card.desc ?? <span className="text-fg-8">Sem descrição.</span>}
            </p>
          </div>
          <div className="flex w-[264px] shrink-0 flex-col gap-5 px-5 py-[22px]">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-fg-8">
                Repositório
              </span>
              <div className="flex h-9 items-center gap-2 rounded-field border border-line-field bg-surface-1 px-[11px] text-[13px] text-fg-2">
                {card.repo ? (
                  <>
                    <span
                      className="size-[7px] shrink-0 rounded-full"
                      style={{ background: REPO_COLORS[card.repo] }}
                    />
                    {card.repo}
                  </>
                ) : (
                  <span className="text-fg-8">sem repo</span>
                )}
                <span className="ml-auto text-fg-7">
                  <ChevronDownIcon size={13} />
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-fg-8">
                Branch sugerida
              </span>
              <div className="flex h-9 items-center gap-2 rounded-field border border-line-field bg-surface-1 py-0 pl-[11px] pr-2">
                <span className="truncate font-mono text-xs text-fg-3">
                  {branch}
                </span>
                <IconButton
                  aria-label="Copiar branch"
                  tinted
                  className="ml-auto hover:bg-primary/25 hover:text-primary-fg-hi"
                  onClick={() => navigator.clipboard?.writeText(branch)}
                >
                  <CopyIcon />
                </IconButton>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-fg-8">
                Pull Request
              </span>
              {card.pr ? (
                <a
                  href={`https://github.com/atrios/pulls/${card.pr}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-field border border-status-done/25 bg-status-done/10 px-[11px] py-[9px]"
                >
                  <span className="text-status-done">
                    <GitGraphIcon size={14} />
                  </span>
                  <span className="font-mono text-[12.5px] text-fg-2">
                    #{card.pr}
                  </span>
                  <span className="text-[11px] text-status-done">aberto</span>
                  <span className="ml-auto text-fg-7">
                    <ExternalIcon />
                  </span>
                </a>
              ) : (
                <div className="flex items-center rounded-field border border-dashed border-line-hover px-[11px] py-[9px] text-xs text-fg-7">
                  Nenhum PR vinculado
                </div>
              )}
              <span className="text-[11px] leading-[1.4] text-fg-9">
                Vinculado automaticamente. Você também pode colar um link
                manualmente.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  IconButton,
  Input,
  RepoChip,
  SegmentedControl,
  SidebarItem,
  StatusPill,
  Stepper,
  TaskCard,
} from "@/components/ui";

/* ---- Inline stroke icons (~1.5, currentColor) ------------------------ */

function ArchLogo({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden="true"
    >
      <path
        fill="#fff"
        d="M39.04 128.87c-1.23,77.99 -0.52,163.71 -0.22,240.81 11.39,-3.28 84.14,-35.7 89.52,-40.65l-0.01 -155.23c2.75,-2.73 11.89,-8.51 15.41,-10.74l32.07 -21.05c4.81,-3.37 11.76,-7.08 16.56,-11.1 0.97,-27.3 0.07,-71.63 0.14,-101.19l-153.47 99.15z"
      />
      <path
        fill="#fff"
        d="M207.59 131.2c4.74,2.03 11.39,7.13 16.07,10.19l48.52 31.16 -0.58 157.71c10.39,3.14 70.09,34.07 89.51,40.04l0.55 -241.76 -76.79 -49.37c-17.31,-11.87 -39.72,-24.95 -57.79,-37.18 -4.81,-3.26 -15.12,-10.65 -19.67,-12.29l0.18 101.5z"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path d="M8 3.5v9M3.5 8h9" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      <rect x="5" y="5" width="8" height="8" rx="1.5" />
      <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" />
    </svg>
  );
}

function GitGraphIcon() {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <circle cx="4" cy="4" r="1.6" />
      <circle cx="4" cy="12" r="1.6" />
      <circle cx="12" cy="7" r="1.6" />
      <path d="M4 5.6v4.8M12 8.6c0 2-2 2.6-4 2.6" strokeLinecap="round" />
    </svg>
  );
}

function KanbanIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      <rect x="2" y="2.5" width="4.5" height="11" rx="1" />
      <rect x="9.5" y="2.5" width="4.5" height="7" rx="1" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M3 4h10M3 8h10M3 12h10" strokeLinecap="round" />
    </svg>
  );
}

/* ---- Specimen chrome -------------------------------------------------- */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-8">
      {children}
    </div>
  );
}

function SectionHeader({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mb-2 flex items-baseline gap-3">
        <span className="font-mono text-xs text-primary-ink">{num}</span>
        <h2 className="text-[26px] font-semibold tracking-[-0.02em] text-fg-hi">
          {title}
        </h2>
      </div>
      <p className="mb-10 text-sm text-fg-6">{children}</p>
    </>
  );
}

function Panel({
  label,
  className = "",
  children,
}: {
  label?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-panel border border-line-strong bg-surface-0 p-[26px] shadow-panel ${className}`}
    >
      {label && (
        <div className="mb-5 text-xs font-semibold text-fg-5">{label}</div>
      )}
      {children}
    </div>
  );
}

function Divider() {
  return <div className="mx-auto mt-16 h-px max-w-[1120px] bg-line-strong" />;
}

/* ---- Specimen data ----------------------------------------------------- */

const STATUS_SPECTRUM = [
  { name: "To Do", cls: "bg-status-todo", hex: "#8B8F98", glow: false },
  { name: "Definição", cls: "bg-status-review", hex: "#5E9EFF", glow: false },
  { name: "Progresso", cls: "bg-status-progress", hex: "#E2B13C", glow: false },
  { name: "Testes", cls: "bg-status-test", hex: "#BB9AF7", glow: false },
  { name: "Produção", cls: "bg-status-done", hex: "#4CB782", glow: true },
  { name: "Arquivado", cls: "bg-status-archived", hex: "#6B6F76", glow: false },
];

const SURFACES = [
  { name: "surface-0", cls: "bg-surface-0", hex: "#08090A" },
  { name: "surface-1", cls: "bg-surface-1", hex: "#0A0B0D" },
  { name: "surface-2", cls: "bg-surface-2", hex: "#0B0C0E" },
  { name: "surface-card", cls: "bg-surface-card", hex: "#111214" },
  { name: "surface-raised", cls: "bg-surface-raised", hex: "#17181B" },
];

const TEXT_RAMP = [
  { name: "fg-hi", cls: "text-fg-hi", hex: "#F2F2F4" },
  { name: "fg-2", cls: "text-fg-2", hex: "#DCDDE1" },
  { name: "fg-3", cls: "text-fg-3", hex: "#C8CAD0" },
  { name: "fg-4", cls: "text-fg-4", hex: "#A9ABB5" },
  { name: "fg-5", cls: "text-fg-5", hex: "#9296A0" },
  { name: "fg-6", cls: "text-fg-6", hex: "#787C88" },
  { name: "fg-7", cls: "text-fg-7", hex: "#6B6F7A" },
  { name: "fg-8", cls: "text-fg-8", hex: "#5C5F6A" },
  { name: "fg-9", cls: "text-fg-9", hex: "#4F525B" },
];

const REPOS = [
  { name: "web", dot: "bg-repo-web", hex: "#7AA2F7" },
  { name: "api", dot: "bg-repo-api", hex: "#E0AF68" },
  { name: "mobile", dot: "bg-repo-mobile", hex: "#BB9AF7" },
];

const SPACE_SCALE = [
  { label: "8", cls: "h-2" },
  { label: "12", cls: "h-3" },
  { label: "16", cls: "h-4" },
  { label: "20", cls: "h-5" },
  { label: "28", cls: "h-7" },
  { label: "44", cls: "h-11" },
];

const RADII_SCALE = [
  { label: "xs·4", cls: "rounded-id" },
  { label: "md·6", cls: "rounded-nav" },
  { label: "lg·8", cls: "rounded-field" },
  { label: "2xl·14", cls: "rounded-panel" },
  { label: "pill", cls: "rounded-pill" },
];

const STEPS = [
  { name: "Descoberta", date: "12 fev" },
  { name: "Definição", date: "03 mar" },
  { name: "Desenvolvimento", date: "24 mar" },
  { name: "Testes", date: "19 mai" },
  { name: "Em Produção", date: "08 jun" },
  { name: "Descontinuado" },
];

/* ---- Page --------------------------------------------------------------- */

export default function DesignSystemPage() {
  const [view, setView] = useState("kanban");

  return (
    <div className="w-full pb-[120px] text-fg-2">
      {/* ===================== COVER ===================== */}
      <div className="mx-auto max-w-[1120px] px-10 pt-[88px]">
        <div className="mb-[38px] flex items-center gap-[13px]">
          <div className="flex size-[34px] items-center justify-center rounded-auth bg-linear-160 from-primary-grad-a to-primary-grad-b shadow-brand">
            <ArchLogo />
          </div>
          <span className="text-[15px] font-semibold tracking-[-0.01em] text-fg-1">
            Átrios
          </span>
          <span className="ml-0.5 rounded-nav bg-white/5 px-2 py-0.5 font-mono text-[11px] text-fg-6">
            v1.0
          </span>
        </div>
        <h1 className="mb-[18px] text-[56px] font-bold leading-[1.02] tracking-[-0.035em] text-fg-hi">
          Átrios
          <br />
          Design System
        </h1>
        <p className="max-w-[600px] text-base leading-[1.6] text-fg-5">
          A linguagem visual do Átrios Management — escura, densa,
          keyboard-first. Superfícies quase-pretas, bordas em fio de cabelo,
          tipografia justa, e{" "}
          <span className="text-fg-3">a cor como linguagem de status.</span>
        </p>
        <div className="mt-[34px] flex flex-wrap gap-2.5">
          {[
            "Dark · dense · Linear-inspired",
            "Inter + mono",
            "11 componentes",
          ].map((chip) => (
            <span
              key={chip}
              className="rounded-pill border border-line-strong px-3.5 py-1.5 text-[12.5px] text-fg-5"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      <Divider />

      {/* ===================== FOUNDATIONS ===================== */}
      <div className="mx-auto max-w-[1120px] px-10 pt-16">
        <SectionHeader num="01" title="Foundations">
          Tokens do design system como utilitários Tailwind. Esta página lê o{" "}
          <span className="font-mono text-fg-5">@theme</span> real.
        </SectionHeader>

        {/* Brand */}
        <div className="mb-11">
          <Eyebrow>Brand · Primary</Eyebrow>
          <div className="flex flex-wrap gap-3.5">
            <div className="flex flex-col gap-[9px]">
              <div className="h-[72px] w-[120px] rounded-field border border-line-strong bg-primary" />
              <span className="text-xs text-fg-4">primary</span>
              <span className="font-mono text-[10.5px] text-fg-7">#5E6AD2</span>
            </div>
            <div className="flex flex-col gap-[9px]">
              <div className="h-[72px] w-[120px] rounded-field border border-line-strong bg-primary-hover" />
              <span className="text-xs text-fg-4">primary-hover</span>
              <span className="font-mono text-[10.5px] text-fg-7">#6B76E0</span>
            </div>
            <div className="flex flex-col gap-[9px]">
              <div className="h-[72px] w-[120px] rounded-field border border-line-strong bg-linear-160 from-primary-grad-a to-primary-grad-b shadow-brand" />
              <span className="text-xs text-fg-4">brand gradient</span>
              <span className="font-mono text-[10.5px] text-fg-7">160°</span>
            </div>
            <div className="flex flex-col gap-[9px]">
              <div className="h-[72px] w-[120px] rounded-field border border-primary/30 bg-primary/15" />
              <span className="text-xs text-fg-4">primary-wash</span>
              <span className="font-mono text-[10.5px] text-fg-7">14% α</span>
            </div>
            <div className="flex flex-col gap-[9px]">
              <div className="flex h-[72px] w-[120px] items-center justify-center rounded-field border border-line-strong bg-surface-1 text-xl font-semibold text-primary-fg">
                Aa
              </div>
              <span className="text-xs text-fg-4">primary-fg</span>
              <span className="font-mono text-[10.5px] text-fg-7">#A9B0EC</span>
            </div>
          </div>
        </div>

        {/* Status spectrum */}
        <div className="mb-11">
          <Eyebrow>Status spectrum</Eyebrow>
          <p className="-mt-2.5 mb-[18px] text-[13px] text-fg-6">
            A cor carrega o significado. O indigo da marca{" "}
            <span className="text-fg-4">não</span> é status — é ação/seleção.
          </p>
          <div className="flex flex-wrap gap-[26px]">
            {STATUS_SPECTRUM.map((c) => (
              <div
                key={c.name}
                className="flex flex-col items-center gap-[11px]"
              >
                <span
                  className={`size-[30px] rounded-full ${c.cls} ${c.glow ? "shadow-glow-done" : ""}`}
                />
                <span className="whitespace-nowrap text-xs text-fg-4">
                  {c.name}
                </span>
                <span className="font-mono text-[10px] text-fg-7">{c.hex}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Surfaces + Text ramp */}
        <div className="mb-11 flex flex-wrap gap-14">
          <div>
            <Eyebrow>Surfaces</Eyebrow>
            <div className="flex flex-wrap gap-2.5">
              {SURFACES.map((c) => (
                <div key={c.name} className="flex flex-col gap-2">
                  <div
                    className={`h-14 w-24 rounded-field border border-line-strong ${c.cls}`}
                  />
                  <span className="text-[11px] text-fg-5">{c.name}</span>
                  <span className="font-mono text-[10px] text-fg-7">
                    {c.hex}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="min-w-[280px] flex-1">
            <Eyebrow>Text ramp</Eyebrow>
            <div className="flex flex-col gap-[9px]">
              {TEXT_RAMP.map((c) => (
                <div key={c.name} className="flex items-baseline gap-3">
                  <span
                    className={`min-w-[90px] text-base font-medium ${c.cls}`}
                  >
                    {c.name}
                  </span>
                  <span className="font-mono text-[10.5px] text-fg-8">
                    {c.hex}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Repository accents */}
        <div className="mb-[52px]">
          <Eyebrow>Repository accents</Eyebrow>
          <div className="flex flex-wrap gap-2.5">
            {REPOS.map((r) => (
              <span
                key={r.name}
                className="inline-flex items-center gap-1.5 rounded-chip border border-line bg-white/[0.04] px-[11px] py-[5px] text-xs text-fg-5"
              >
                <span className={`size-[7px] rounded-full ${r.dot}`} />
                {r.name}
                <span className="font-mono text-[10px] text-fg-7">{r.hex}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Typography */}
        <Eyebrow>Typography</Eyebrow>
        <div className="mb-11 rounded-panel border border-line-strong bg-surface-0 p-8 shadow-panel">
          <div className="flex flex-col gap-[22px]">
            <div className="flex flex-wrap items-baseline gap-[18px]">
              <span className="text-[44px] font-bold tracking-[-0.03em] text-fg-hi">
                Pórtico
              </span>
              <span className="font-mono text-[11px] text-fg-7">
                Inter · 44 / 700 / -0.03em
              </span>
            </div>
            <div className="flex flex-wrap items-baseline gap-[18px]">
              <span className="text-[25px] font-semibold tracking-[-0.02em] text-fg-1">
                Página do produto
              </span>
              <span className="font-mono text-[11px] text-fg-7">
                display · 25 / 600
              </span>
            </div>
            <div className="flex flex-wrap items-baseline gap-[18px]">
              <span className="text-[19px] font-semibold tracking-[-0.01em] text-fg-2">
                Retry de webhooks do Stripe
              </span>
              <span className="font-mono text-[11px] text-fg-7">
                h3 · 19 / 600
              </span>
            </div>
            <div className="h-px bg-line" />
            <div className="max-w-[640px] text-[13.5px] leading-[1.6] text-fg-4">
              Reprocessar webhooks que falham no primeiro envio com backoff
              exponencial. Guardar o payload bruto e o status de cada tentativa
              para auditoria.{" "}
              <span className="font-mono text-[11px] text-fg-8">
                — body · 13.5 / 1.6
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3.5">
              <span className="font-mono text-[11px] text-fg-7">POR-27</span>
              <span className="rounded-id bg-white/5 px-1.5 py-px font-mono text-[11px] tracking-[0.04em] text-fg-5">
                POR
              </span>
              <span className="font-mono text-xs text-fg-3">
                por-19-retry-webhooks
              </span>
              <span className="font-mono text-[12.5px] text-fg-2">
                <span className="text-fg-8">atrios/</span>portico-api
              </span>
              <span className="font-mono text-[11px] text-fg-8">
                — mono: ids, codes, branches, repos
              </span>
            </div>
          </div>
        </div>

        {/* Spacing + Radii + Elevation */}
        <div className="flex flex-wrap gap-14">
          <div>
            <Eyebrow>Spacing</Eyebrow>
            <div className="flex items-end gap-3.5">
              {SPACE_SCALE.map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-2">
                  <div className="flex h-11 items-end">
                    <div
                      className={`w-[26px] rounded-[2px] bg-primary ${s.cls}`}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-fg-7">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Eyebrow>Radii</Eyebrow>
            <div className="flex items-start gap-3.5">
              {RADII_SCALE.map((r) => (
                <div key={r.label} className="flex flex-col items-center gap-2">
                  <div
                    className={`h-12 w-[52px] border border-line-field bg-surface-card ${r.cls}`}
                  />
                  <span className="font-mono text-[10px] text-fg-7">
                    {r.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Eyebrow>Elevation &amp; glow</Eyebrow>
            <div className="flex items-center gap-[22px] pt-1.5">
              <div className="flex flex-col items-center gap-3">
                <div className="h-[52px] w-20 rounded-panel border border-line-strong bg-surface-card shadow-panel" />
                <span className="font-mono text-[10px] text-fg-7">panel</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="h-[52px] w-20 rounded-panel border border-primary/30 bg-surface-card shadow-glow-new" />
                <span className="font-mono text-[10px] text-fg-7">
                  glow-new
                </span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <span className="size-[22px] rounded-full bg-status-done shadow-glow-current" />
                <span className="font-mono text-[10px] text-fg-7">status</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Divider />

      {/* ===================== COMPONENTS ===================== */}
      <div className="mx-auto max-w-[1120px] px-10 pt-16">
        <SectionHeader num="02" title="Components">
          11 primitivos reutilizáveis. Passe o mouse para ver os estados.
        </SectionHeader>

        {/* Buttons */}
        <Panel label="Button · IconButton · Avatar" className="mb-5">
          <div className="mb-3.5 flex flex-wrap items-center gap-3">
            <Button>Criar produto</Button>
            <Button variant="secondary">Cancelar</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="dashed" icon={<PlusIcon />}>
              Adicionar repositório
            </Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <IconButton aria-label="Fechar">
              <CloseIcon />
            </IconButton>
            <IconButton tinted aria-label="Copiar">
              <CopyIcon />
            </IconButton>
            <Avatar initials="MA" />
            <Avatar initials="JR" size={34} />
          </div>
        </Panel>

        {/* Status + repos + badges */}
        <Panel label="StatusPill · RepoChip · Badge" className="mb-5">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <StatusPill hue="done" glow>
              Em Produção
            </StatusPill>
            <StatusPill hue="progress">Em Progresso</StatusPill>
            <StatusPill hue="review">Definição</StatusPill>
            <StatusPill hue="test">Testes</StatusPill>
            <StatusPill hue="archived">Descontinuado</StatusPill>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <RepoChip name="web" />
            <RepoChip name="api" />
            <RepoChip name="mobile" />
            <span className="mx-1 h-5 w-px bg-line-strong" />
            <Badge tone="primary">novo</Badge>
            <Badge tone="primary" pulse icon={<GitGraphIcon />}>
              auto
            </Badge>
            <Badge tone="neutral" mono>
              #142
            </Badge>
          </div>
        </Panel>

        {/* Forms + Sidebar */}
        <div className="mb-5 flex flex-wrap gap-5">
          <Panel
            label="Input · SegmentedControl"
            className="min-w-[340px] flex-1"
          >
            <div className="flex flex-col gap-3">
              <Input placeholder="Nome do produto" />
              <div className="flex items-center gap-3">
                <Input mono focused defaultValue="POR" className="w-24" />
                <SegmentedControl
                  value={view}
                  onChange={setView}
                  options={[
                    { value: "kanban", label: "Kanban", icon: <KanbanIcon /> },
                    { value: "lista", label: "Lista", icon: <ListIcon /> },
                  ]}
                />
              </div>
            </div>
          </Panel>
          <Panel label="SidebarItem" className="w-[250px]">
            <div className="flex flex-col gap-0.5">
              <SidebarItem
                label="Pórtico"
                color="var(--color-status-done)"
                active
              />
              <SidebarItem
                label="Cortina"
                color="var(--color-status-progress)"
              />
              <SidebarItem label="Ábaco" color="var(--color-status-test)" />
              <SidebarItem
                label="Frontão"
                color="var(--color-status-archived)"
              />
            </div>
          </Panel>
        </div>

        {/* Task cards + Stepper */}
        <Panel label="TaskCard · Stepper">
          <div className="mb-[30px] flex flex-wrap gap-3">
            <TaskCard
              id="POR-27"
              title="Configurar alertas de falha no gateway"
              repo="api"
              isNew
              className="w-[236px]"
            />
            <TaskCard
              id="POR-17"
              title="Refatorar serviço de conciliação"
              repo="api"
              prNum={138}
              className="w-[236px]"
            />
            <TaskCard
              id="POR-20"
              title="Tela de histórico de transações"
              repo="web"
              prNum={140}
              className="w-[236px]"
            />
          </div>
          <Stepper steps={STEPS} current={4} className="max-w-[760px]" />
        </Panel>
      </div>

      {/* ===================== FOOTER ===================== */}
      <div className="mx-auto mt-20 max-w-[1120px] px-10">
        <div className="flex flex-wrap items-center gap-2.5 border-t border-line-strong pt-7">
          <div className="flex size-[22px] items-center justify-center rounded-nav bg-linear-160 from-primary-grad-a to-primary-grad-b">
            <ArchLogo size={12} />
          </div>
          <span className="text-[13px] text-fg-5">Átrios Design System</span>
          <span className="ml-auto font-mono text-[13px] text-fg-8">
            tokens · type · components — do @theme real
          </span>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";

// Fundo compartilhado das páginas legais: mesmo radial + grade das telas de auth.
export default function LegalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-surface-0">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 60% at 50% 0%, rgba(94,106,210,0.12), transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)",
          backgroundSize: "38px 38px",
          maskImage:
            "radial-gradient(70% 55% at 50% 40%, #000 20%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-3xl px-6 py-12 sm:py-16">
        <header className="mb-10 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold text-fg-1 transition-colors hover:text-fg-hi"
          >
            Átrios Management
          </Link>
          <nav className="flex items-center gap-5 text-[13px] text-fg-6">
            <Link href="/termos" className="transition-colors hover:text-fg-2">
              Termos de Serviço
            </Link>
            <Link
              href="/privacidade"
              className="transition-colors hover:text-fg-2"
            >
              Política de Privacidade
            </Link>
          </nav>
        </header>

        <main>{children}</main>

        <footer className="mt-14 border-t border-line pt-6 text-[13px] text-fg-7">
          © {new Date().getFullYear()} Átrios. Todos os direitos reservados.
        </footer>
      </div>
    </div>
  );
}

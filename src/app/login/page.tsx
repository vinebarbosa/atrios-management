import Link from "next/link";
import { ArchLogo, GitHubIcon } from "@/components/icons";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-surface-0">
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
      <div className="relative flex w-[352px] flex-col items-center text-center">
        <div className="mb-[26px] flex size-[52px] items-center justify-center rounded-panel bg-linear-160 from-primary-grad-a to-primary-grad-b [box-shadow:0_10px_30px_rgba(94,106,210,0.4)]">
          <ArchLogo size={26} />
        </div>
        <h1 className="mb-2 text-[21px] font-semibold tracking-[-0.02em] text-fg-hi">
          Átrios Management
        </h1>
        <p className="mb-[30px] max-w-[270px] text-[13.5px] leading-normal text-fg-6">
          Acompanhe os produtos de software da Átrios em um só lugar.
        </p>
        <Link
          href="/produtos"
          className="flex h-11 w-full items-center justify-center gap-2.5 rounded-auth border border-line-field-strong bg-surface-raised text-sm font-medium text-fg-1 transition-colors duration-200 hover:border-line-hover hover:bg-[#1e1f23]"
        >
          <GitHubIcon />
          Continuar com GitHub
        </Link>
        <p className="mt-[22px] text-[11.5px] text-fg-9">
          Acesso restrito ao time da Átrios.
        </p>
      </div>
    </div>
  );
}

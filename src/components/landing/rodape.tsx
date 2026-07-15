import Link from "next/link";
import { cn } from "@/lib/cn";
import {
  CONTATO_EMAIL,
  WHATSAPP_EXIBICAO,
  whatsappUrl,
} from "@/lib/landing/config";

// Rodapé compartilhado das páginas públicas: linha de contato + política de
// privacidade. `children` recebe o texto de topo específico de cada página.

const link = "text-primary-ink no-underline hover:text-primary-fg";

export function Rodape({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 border-t border-line pt-4",
        className,
      )}
    >
      {children}
      <span className="text-[12.5px] text-fg-6">
        <a href={`mailto:${CONTATO_EMAIL}`} className={link}>
          {CONTATO_EMAIL}
        </a>{" "}
        · WhatsApp{" "}
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className={link}
        >
          {WHATSAPP_EXIBICAO}
        </a>{" "}
        ·{" "}
        <Link href="/privacidade" className={link}>
          Política de privacidade
        </Link>
      </span>
    </div>
  );
}

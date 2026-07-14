import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Preview do link no WhatsApp/redes (tela 1e do handoff), gerada em 1200×630.
// Satori só suporta flexbox e um subconjunto de CSS — sem grid, sem filtros
// (por isso a logo é a versão já branca, atrios-logo-white.png, em vez do
// PNG escuro + filter:invert usado na própria landing).

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Diagnóstico gratuito — Provimento CNJ 213/2026";

const PILLS = ["20 minutos", "Relatório por escrito", "Sem custo"];

export default async function OpenGraphImage() {
  const logoData = await readFile(
    join(process.cwd(), "public/landing/atrios-logo-white.png"),
  );
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "70px 80px",
        backgroundColor: "#07080d",
        backgroundImage:
          "radial-gradient(120% 110% at 22% -5%, #101527 0%, #07080d 58%, #050506 100%)",
        fontFamily: "sans-serif",
      }}
    >
      {/* biome-ignore lint/performance/noImgElement: Satori (next/og) exige <img>, não next/image */}
      <img src={logoSrc} height={46} alt="Átrios" />

      <div style={{ display: "flex", flexDirection: "column", maxWidth: 900 }}>
        <div
          style={{
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "#8b93ec",
            marginBottom: 18,
          }}
        >
          Diagnóstico gratuito
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.12,
            color: "#f2f2f4",
          }}
        >
          Sua serventia está pronta para o Provimento CNJ 213/2026?
        </div>
      </div>

      <div style={{ display: "flex", gap: 14 }}>
        {PILLS.map((p) => (
          <div
            key={p}
            style={{
              fontSize: 22,
              fontWeight: 500,
              color: "#c8cad0",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 99,
              padding: "10px 24px",
            }}
          >
            {p}
          </div>
        ))}
      </div>
    </div>,
    size,
  );
}

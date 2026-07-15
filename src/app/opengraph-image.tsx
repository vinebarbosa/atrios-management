import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Preview do link no WhatsApp/redes, gerada em 1200×630 — mesmo padrão da
// /diagnostico. Satori só suporta flexbox e um subconjunto de CSS — sem grid,
// sem filtros (por isso a logo é a versão já branca, atrios-logo-white.png, em
// vez do PNG escuro + filter:invert usado na própria página).

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "Átrios Tecnologia e Consultoria: constrói e protege sistemas";

// As três frentes, na ordem do site. Este card é o da home: quando ele falava só
// de cartórios, contradizia o título e a descrição, que anunciam a empresa de
// tecnologia. O card exclusivo do Provimento é o da /diagnostico.
const PILLS = [
  "Software sob medida",
  "Segurança e LGPD",
  "Cartórios e Prov. 213",
];

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
      <img src={logoSrc} height={104} alt="Átrios" />

      <div style={{ display: "flex", flexDirection: "column", maxWidth: 940 }}>
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
          Tecnologia e Consultoria
        </div>
        <div
          style={{
            fontSize: 62,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.12,
            color: "#f2f2f4",
          }}
        >
          A Átrios constrói e protege os sistemas de que a sua operação depende
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

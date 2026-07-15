import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

// Rotas alcançáveis sem sessão. Checagem otimista (só presença do cookie):
// a verificação real acontece no AppShell/actions com auth.api.getSession.
// `diagnostico` (singular) é a landing pública de pré-cadastro; o `(\/|$)` evita
// casar `/diagnosticos` (plural, módulo interno autenticado).
// `opengraph-image`/`twitter-image` são as rotas de imagem do site institucional
// (convention do App Router): não têm ponto no path, então o matcher abaixo NÃO
// as ignora e, sem estarem aqui, o crawler do WhatsApp levava 307 pro /login e o
// card saía sem imagem. As da /diagnostico já passam pelo prefixo `diagnostico`.
// `site` é o site institucional público (era `/`, ver next.config.ts).
const PUBLIC =
  /^\/(login|esqueci-senha|redefinir-senha|convite|sem-convite|termos|privacidade|diagnostico|site|opengraph-image|twitter-image|api\/auth)(\/|$)/;

// `/` só redireciona pra /diagnostico (next.config.ts), mas segue público aqui
// para que o visitante sem sessão receba o redirect em vez de cair no /login.
// Precisa de teste próprio porque o PUBLIC acima exige um segmento depois da
// barra. Quem tem sessão e quer o app entra direto em /produtos (o login já
// redireciona pra lá).
export const isPublic = (pathname: string) =>
  pathname === "/" || PUBLIC.test(pathname);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(getSessionCookie(request));

  if (isPublic(pathname)) {
    if (hasSession && pathname === "/login") {
      return NextResponse.redirect(new URL("/produtos", request.url));
    }
    return NextResponse.next();
  }
  if (!hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\..*).*)"],
};

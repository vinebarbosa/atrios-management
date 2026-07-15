import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// O alias `@/` do tsconfig não existe pro runtime do vitest: sem isto, todo
// import de VALOR via `@/...` quebra no teste (os de tipo passam porque somem
// na compilação). Espelha o `paths` do tsconfig.json.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});

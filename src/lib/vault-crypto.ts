// Cifra dos segredos do cofre — AES-256-GCM, chave de 32 bytes em VAULT_KEY.
// Perder a chave torna os segredos irrecuperáveis (uso interno, sem rotação de chave).

import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

function key(): Buffer {
  const raw = process.env.VAULT_KEY;
  if (!raw)
    throw new Error(
      "VAULT_KEY ausente — gere com `openssl rand -base64 32` e configure no .env",
    );
  const buf = Buffer.from(raw, "base64");
  if (buf.length !== 32)
    throw new Error("VAULT_KEY inválida — precisa de 32 bytes em base64");
  return buf;
}

/** Retorna `iv:tag:cifra` em base64. */
export function encryptSecret(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), enc]
    .map((b) => b.toString("base64"))
    .join(":");
}

export function decryptSecret(blob: string): string {
  const [iv, tag, enc] = blob.split(":").map((p) => Buffer.from(p, "base64"));
  const decipher = createDecipheriv("aes-256-gcm", key(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString(
    "utf8",
  );
}

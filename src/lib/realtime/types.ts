/** Evento de mudança transmitido por realtime (payload pequeno — só o "sino"). */
export interface RealtimeEvent {
  /** Canal lógico (ex.: "private-product-<id>", "private-cofre"). */
  channel: string;
  /** Tipo do evento (ex.: "card.updated", "changed"). */
  type: string;
  /** Id do recurso afetado, quando aplicável. */
  id?: string;
  /** Usuário que causou a mudança — usado para suprimir o eco no próprio autor. */
  actorId?: string;
  /** Epoch em ms de quando o evento foi publicado. */
  ts: number;
}

/** Nome do evento Pusher (um só; o tipo específico vai no payload). */
export const REALTIME_EVENT = "change";

// Canais privados do Pusher: exigem o prefixo `private-` e não aceitam `:`
// (só a-z A-Z 0-9 _ - = @ , . ;). Ids são UUIDs, cujos hífens são válidos.
export const channels = {
  product: (productId: string) => `private-product-${productId}`,
  cofre: "private-cofre",
  time: "private-time",
  diagnosticos: "private-diagnosticos",
  documents: (productId: string) => `private-documents-${productId}`,
} as const;

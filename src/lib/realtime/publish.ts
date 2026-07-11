import { pusherServer } from "./pusher-server";
import { REALTIME_EVENT, type RealtimeEvent } from "./types";

/**
 * Publica um evento de mudança via Pusher. Chamado pelas server actions **após**
 * a gravação. Nunca lança: uma falha de publicação só significa que os outros
 * clientes ressincronizam mais tarde (ao reconectar/refocar), então não pode
 * derrubar a mutação — é só logada. Sem credenciais, vira no-op.
 */
export async function publish(
  event: Omit<RealtimeEvent, "ts"> & { ts?: number },
): Promise<void> {
  const pusher = pusherServer();
  if (!pusher) return;
  try {
    await pusher.trigger(event.channel, REALTIME_EVENT, {
      ...event,
      ts: event.ts ?? Date.now(),
    });
  } catch (err) {
    console.error("[realtime] pusher trigger falhou", err);
  }
}

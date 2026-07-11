"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { pusherBrowser } from "./pusher-browser";
import { REALTIME_EVENT, type RealtimeEvent } from "./types";

export type RealtimeStatus = "connecting" | "open" | "reconnecting";

/**
 * Assina o canal Pusher `channel`. O pusher-js cuida da reconexão sozinho;
 * `onResync` é chamado ao reconectar (para cobrir eventos perdidos durante a
 * queda) e ao voltar a aba para o primeiro plano. Retorna o estado da conexão.
 */
export function useRealtime(
  channel: string,
  onEvent?: (event: RealtimeEvent) => void,
  onResync?: () => void,
): RealtimeStatus {
  const [status, setStatus] = useState<RealtimeStatus>("connecting");
  // refs para os callbacks: evitam re-assinar o canal a cada render.
  const onEventRef = useRef(onEvent);
  const onResyncRef = useRef(onResync);
  onEventRef.current = onEvent;
  onResyncRef.current = onResync;

  useEffect(() => {
    const pusher = pusherBrowser();
    if (!pusher) return; // realtime desligado (sem chaves)

    const ch = pusher.subscribe(channel);
    const handler = (data: RealtimeEvent) => onEventRef.current?.(data);
    ch.bind(REALTIME_EVENT, handler);

    let wasConnected = pusher.connection.state === "connected";
    const onState = () => {
      const s = pusher.connection.state;
      if (s === "connected") {
        setStatus("open");
        if (!wasConnected) onResyncRef.current?.(); // reconectou: ressincroniza
        wasConnected = true;
      } else if (s === "connecting" || s === "initialized") {
        setStatus("connecting");
      } else {
        setStatus("reconnecting");
        wasConnected = false;
      }
    };
    onState();
    pusher.connection.bind("state_change", onState);

    const onVisibility = () => {
      if (document.visibilityState === "visible") onResyncRef.current?.();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      ch.unbind(REALTIME_EVENT, handler);
      pusher.unsubscribe(channel);
      pusher.connection.unbind("state_change", onState);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [channel]);

  return status;
}

/**
 * Assina `channel` e dispara `router.refresh()` (debounced) a cada evento —
 * granularidade de página para telas que não precisam de merge fino. Eventos
 * originados pelo próprio usuário (`selfId`) são ignorados: o autor já teve o
 * `revalidatePath` da sua própria mutation.
 */
export function useRealtimeRefresh(
  channel: string,
  selfId?: string,
): RealtimeStatus {
  const router = useRouter();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleRefresh = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => router.refresh(), 300);
  }, [router]);

  const onEvent = useCallback(
    (event: RealtimeEvent) => {
      if (selfId && event.actorId === selfId) return;
      scheduleRefresh();
    },
    [selfId, scheduleRefresh],
  );

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return useRealtime(channel, onEvent, scheduleRefresh);
}

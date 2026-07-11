"use client";

import Pusher from "pusher-js";

// Singleton do pusher-js no browser (uma conexão para toda a aba). Retorna null
// se as chaves públicas não estão configuradas — realtime fica desligado.
let instance: Pusher | null | undefined;

export function pusherBrowser(): Pusher | null {
  if (instance !== undefined) return instance;
  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
  instance =
    key && cluster
      ? new Pusher(key, { cluster, authEndpoint: "/api/pusher/auth" })
      : null;
  return instance;
}

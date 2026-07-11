import Pusher from "pusher";

// Singleton do cliente Pusher no servidor. Retorna null se as credenciais não
// estão configuradas — assim o realtime fica desligado sem derrubar o app
// (útil em dev/preview antes de setar as chaves).
let instance: Pusher | null | undefined;

export function pusherServer(): Pusher | null {
  if (instance !== undefined) return instance;
  const appId = process.env.PUSHER_APP_ID;
  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const secret = process.env.PUSHER_SECRET;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
  instance =
    appId && key && secret && cluster
      ? new Pusher({ appId, key, secret, cluster, useTLS: true })
      : null;
  return instance;
}

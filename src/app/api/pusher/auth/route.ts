// Autorização de canais privados do Pusher. O pusher-js chama este endpoint
// (POST form-encoded com socket_id + channel_name) antes de assinar um canal
// `private-`. Só assina o token se houver sessão better-auth válida.

import { auth } from "@/lib/auth";
import { pusherServer } from "@/lib/realtime/pusher-server";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return new Response("Unauthorized", { status: 403 });

  const pusher = pusherServer();
  if (!pusher) return new Response("Realtime disabled", { status: 503 });

  const form = new URLSearchParams(await request.text());
  const socketId = form.get("socket_id");
  const channel = form.get("channel_name");
  if (!socketId || !channel || !channel.startsWith("private-"))
    return new Response("Bad Request", { status: 400 });

  return Response.json(pusher.authorizeChannel(socketId, channel));
}

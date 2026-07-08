// Envio de email: Resend quando configurado (INVITE_EMAIL_PROVIDER=resend +
// RESEND_API_KEY), senão cai no log de console — dev funciona sem chaves.
export async function sendEmail(opts: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  const provider = process.env.INVITE_EMAIL_PROVIDER;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (provider === "resend" && apiKey && from) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: opts.to,
          subject: opts.subject,
          html: opts.html,
          text: opts.text,
        }),
      });
      if (!res.ok) {
        console.error(
          `[email] Resend falhou (${res.status}): ${await res.text()}`,
        );
      }
    } catch (err) {
      console.error("[email] Resend erro de rede:", err);
    }
    return;
  }

  console.log(`\n[email] → ${opts.to}\n  ${opts.subject}\n  ${opts.text}\n`);
}

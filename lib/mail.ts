import "server-only";
import { env } from "./env";

/** Remitente por defecto de Resend: solo entrega al correo de la cuenta de Resend (sin dominio verificado). */
const DEFAULT_FROM = "Portfolio <onboarding@resend.dev>";

export function isMailConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim() && contactRecipient());
}

function contactRecipient() {
  return process.env.CONTACT_TO_EMAIL?.trim() || env.adminEmail;
}

export type ContactMessage = { name: string; email: string; subject: string | null; message: string };

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** Envía el mensaje del formulario de contacto a tu correo usando la API REST de Resend. */
export async function sendContactEmail(msg: ContactMessage) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = contactRecipient();
  if (!apiKey || !to) throw new Error("Resend no está configurado (RESEND_API_KEY / ADMIN_EMAIL).");

  const subject = `Nuevo mensaje de ${msg.name}${msg.subject ? ` — ${msg.subject}` : ""}`;
  const text = [
    `Nombre: ${msg.name}`,
    `Correo: ${msg.email}`,
    msg.subject ? `Asunto: ${msg.subject}` : null,
    "",
    msg.message,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const html = `
<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:560px;margin:0 auto;color:#111">
  <p style="font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#777;margin:0 0 16px">Formulario de contacto · Portfolio</p>
  <h1 style="font-size:22px;margin:0 0 20px">Nuevo mensaje de ${escapeHtml(msg.name)}</h1>
  <table style="font-size:14px;border-collapse:collapse;margin-bottom:20px">
    <tr><td style="color:#777;padding:4px 16px 4px 0">Nombre</td><td>${escapeHtml(msg.name)}</td></tr>
    <tr><td style="color:#777;padding:4px 16px 4px 0">Correo</td><td><a href="mailto:${escapeHtml(msg.email)}">${escapeHtml(msg.email)}</a></td></tr>
    ${msg.subject ? `<tr><td style="color:#777;padding:4px 16px 4px 0">Asunto</td><td>${escapeHtml(msg.subject)}</td></tr>` : ""}
  </table>
  <div style="font-size:15px;line-height:1.6;white-space:pre-wrap;border-left:3px solid #c6ff3d;padding:12px 16px;background:#f6f6f4">${escapeHtml(msg.message)}</div>
  <p style="font-size:12px;color:#999;margin-top:24px">Responde a este correo para contestarle directamente.</p>
</div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL?.trim() || DEFAULT_FROM,
      to: [to],
      reply_to: msg.email,
      subject,
      text,
      html,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend respondió ${res.status}: ${detail}`);
  }
}

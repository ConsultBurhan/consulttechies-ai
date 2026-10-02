// POST /api/contact  { name, email, message, company?, phone?, interest? }  ->  emails MAIL_TO
import { sendEmail } from './email.mjs'

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
const reply = (res, code, body) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)) }

export async function contactHandler(req, res, next) {
  if (!req.url?.startsWith('/api/contact')) return next()
  if (req.method !== 'POST') return reply(res, 405, { error: 'method' })
  try {
    let raw = ''
    for await (const chunk of req) { raw += chunk; if (raw.length > 20_000) return reply(res, 413, { error: 'too_large' }) }
    const b = JSON.parse(raw)
    if (b.website) return reply(res, 200, { ok: true }) // hidden spam trap
    if (!b.name?.trim() || !/^\S+@\S+\.\S+$/.test(b.email ?? '') || !b.message?.trim()) return reply(res, 422, { error: 'invalid' })
    const { MAIL_TO, MAIL_FROM, AZURE_TENANT, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET } = process.env
    if (![MAIL_TO, MAIL_FROM, AZURE_TENANT, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET].every(Boolean)) return reply(res, 503, { error: 'not_configured' })

    const rows = [['Name', b.name], ['Company', b.company], ['Email', b.email], ['Phone', b.phone], ['Interested in', b.interest]].filter(([, v]) => v)
    await sendEmail({
      to: MAIL_TO,
      subject: `Demo request: ${b.name}${b.company ? ` (${b.company})` : ''}`,
      replyTo: b.email,
      content: `<h2>New demo request</h2><table cellpadding="6">${rows.map(([k, v]) => `<tr><td><b>${k}</b></td><td>${esc(v)}</td></tr>`).join('')}</table><p style="white-space:pre-wrap">${esc(b.message)}</p>`,
    })
    reply(res, 200, { ok: true })
  } catch (e) {
    console.error('[contact]', e.message)
    reply(res, 502, { error: 'send_failed' })
  }
}

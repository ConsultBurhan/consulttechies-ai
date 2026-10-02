// Microsoft Graph email, as one plain function (port of the Python EmailService).
const TOKEN_URI = 'https://login.microsoftonline.com/{0}/oauth2/v2.0/token'
const GRAPH = 'https://graph.microsoft.com/v1.0'
const SCOPE = 'https://graph.microsoft.com/.default'
const TIMEOUT = 30_000

let token = '', expiresAt = 0

async function getToken(env) {
  if (token && Date.now() < expiresAt - 60_000) return token // reuse until 60s before expiry
  const r = await fetch(TOKEN_URI.replace('{0}', env.AZURE_TENANT), {
    method: 'POST',
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: env.AZURE_CLIENT_ID, client_secret: env.AZURE_CLIENT_SECRET, scope: SCOPE }),
    signal: AbortSignal.timeout(TIMEOUT),
  })
  if (!r.ok) throw new Error(`token request failed (${r.status})`)
  const j = await r.json()
  token = j.access_token; expiresAt = Date.now() + Number(j.expires_in ?? 3600) * 1000
  return token
}

/** sendEmail({ to, subject, content, replyTo? }) — HTML email from MAIL_FROM, copied to CC_EMAIL if set. Throws on failure. */
export async function sendEmail({ to, subject, content, replyTo }) {
  const env = process.env
  const from = env.MAIL_FROM
  const message = {
    subject,
    body: { contentType: 'HTML', content },
    from: { emailAddress: { name: 'Website demo request', address: from } },
    toRecipients: [{ emailAddress: { address: to } }],
    ...(env.CC_EMAIL && { ccRecipients: [{ emailAddress: { address: env.CC_EMAIL } }] }),
    ...(replyTo && { replyTo: [{ emailAddress: { address: replyTo } }] }),
  }
  for (const attempt of [1, 2]) {
    const r = await fetch(`${GRAPH}/users/${from}/sendMail`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${await getToken(env)}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, saveToSentItems: true }),
      signal: AbortSignal.timeout(TIMEOUT),
    })
    if (r.status === 401 && attempt === 1) { token = ''; continue } // cached token revoked: refresh once and retry
    if (r.status !== 200 && r.status !== 202) throw new Error(`Graph sendMail failed (${r.status}): ${await r.text()}`)
    return
  }
}

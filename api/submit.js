const { Resend } = require('resend');

function buildEmailHtml({ name, email, note, answers, prompt_result, source }) {
  const rows = [
    ['İsim', name],
    ['E-posta', email],
    ['Not', note],
    ['Kaynak', source],
    ['Prompt Sonucu', prompt_result],
  ];

  let answersHtml = '';
  if (answers && typeof answers === 'object') {
    const entries = Array.isArray(answers)
      ? answers.map((v, i) => [`Soru ${i + 1}`, v])
      : Object.entries(answers);
    answersHtml = entries
      .map(([k, v]) => `<tr><td style="padding:4px 8px;font-weight:bold;white-space:nowrap">${k}</td><td style="padding:4px 8px">${v ?? '—'}</td></tr>`)
      .join('');
  }

  const baseRows = rows
    .map(([k, v]) => `<tr><td style="padding:4px 8px;font-weight:bold;white-space:nowrap">${k}</td><td style="padding:4px 8px">${v ?? '—'}</td></tr>`)
    .join('');

  return `
    <html><body style="font-family:sans-serif;color:#222">
      <h2 style="margin-bottom:16px">Yeni Dövme Talebi</h2>
      <table style="border-collapse:collapse;width:100%">
        <tbody>
          ${baseRows}
          ${answersHtml}
        </tbody>
      </table>
    </body></html>
  `;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Future: Cloudflare Turnstile token verification goes here
  // const { token } = req.body;
  // const turnstileOk = await verifyTurnstile(token, req.headers['x-forwarded-for']);
  // if (!turnstileOk) return res.status(403).json({ error: 'Bot check failed' });

  const {
    name,
    email,
    note,
    answers,
    prompt_result,
    source,
    'bot-field': botField
  } = req.body || {};

  // Honeypot: bot filled the hidden field — silently succeed without inserting
  if (botField) {
    return res.status(200).json({ ok: true });
  }

  const supabaseUrl     = process.env.SUPABASE_URL;
  const serviceRoleKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[submit] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'apikey':        serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Prefer':        'return=minimal'
      },
      body: JSON.stringify({ name, email, note, answers, prompt_result, source })
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('[submit] Supabase error:', response.status, text);
      return res.status(502).json({ error: 'Database write failed' });
    }

    // Send notification email — failure does NOT block the successful response
    try {
      const resendKey = process.env.RESEND_API_KEY;
      if (!resendKey) throw new Error('RESEND_API_KEY not set');

      const resend = new Resend(resendKey);
      const { error: mailApiError } = await resend.emails.send({
        from:    'Can Levi Tattoo <info@canlevi.com>',
        to:      'info@canlevi.com',
        subject: `Yeni Talep: ${name || 'İsimsiz'}`,
        html:    buildEmailHtml({ name, email, note, answers, prompt_result, source }),
      });
      if (mailApiError) throw new Error(mailApiError.message || JSON.stringify(mailApiError));
    } catch (mailErr) {
      console.error('[submit] Resend error (non-fatal):', mailErr);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[submit] Unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

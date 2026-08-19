import { Resend } from 'resend'
import { type NextRequest } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

// In-memory rate limit store: IP -> list of submission timestamps
const rateLimitStore = new Map<string, number[]>()
const WINDOW_MS = 60 * 60 * 1000 // 1 hour
const MAX_PER_WINDOW = 3

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const times = (rateLimitStore.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (times.length >= MAX_PER_WINDOW) return false
  rateLimitStore.set(ip, [...times, now])
  return true
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[0-9+\-\s()]{6,20}$/
const SUBJECT_WHITELIST = new Set(['general', 'order', 'custom', 'support', 'other'])

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'

  let body: Record<string, string>
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { name, email, phone, subject, message, website, recaptchaToken } = body

  // Honeypot — silent accept so bots don't know they were blocked
  if (website) {
    return Response.json({ success: true })
  }

  // reCAPTCHA v3 verification
  if (!recaptchaToken) {
    console.error('[contact] Missing recaptchaToken in request body')
    return Response.json({ error: 'Bot detected. Please try again.' }, { status: 400 })
  }
  const verify = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
  })
  const verifyData = await verify.json()
  if (!verifyData.success || verifyData.score < 0.5) {
    // Log Google's actual error codes (e.g. hostname mismatch, invalid key) for diagnosis.
    // Check these in your server/Vercel logs if this keeps happening — it almost
    // always means the current domain isn't added under this reCAPTCHA site key
    // in https://www.google.com/recaptcha/admin
    console.error('[contact] reCAPTCHA verification failed:', {
      success: verifyData.success,
      score: verifyData.score,
      errorCodes: verifyData['error-codes'],
      hostname: verifyData.hostname,
    })
    return Response.json({ error: 'Bot detected. Please try again.' }, { status: 400 })
  }

  // Validation
  const errors: string[] = []
  if (!name?.trim()) errors.push('Name is required.')
  if (name && name.length > 100) errors.push('Name must be under 100 characters.')
  if (email?.trim() && (!EMAIL_RE.test(email.trim()) || email.length > 254)) errors.push('Please enter a valid email.')
  if (!phone?.trim() || !PHONE_RE.test(phone.trim())) errors.push('A valid phone number is required.')
  if (!subject?.trim() || subject.length > 60) errors.push('Subject is required.')
  if (!message?.trim()) errors.push('Message is required.')
  if (message && message.length > 2000) errors.push('Message must be under 2000 characters.')

  if (errors.length > 0) {
    return Response.json({ error: errors.join(' ') }, { status: 400 })
  }

  // Rate limit (after honeypot + validation to avoid counting bot/bad traffic)
  if (!checkRateLimit(ip)) {
    return Response.json(
      { error: 'Too many submissions. Please try again in an hour.' },
      { status: 429 }
    )
  }

  try {
    const safeName = escapeHtml(name.trim())
    const safeEmail = email?.trim() ? escapeHtml(email.trim()) : ''
    const safePhone = escapeHtml(phone.trim())
    const safeSubject = escapeHtml(subject.trim())
    const safeMessage = escapeHtml(message.trim())

    await resend.emails.send({
      from: 'Elite Handpan <onboarding@resend.dev>',
      to: 'trade4behzad@gmail.com',
      subject: `[Elite Handpan] ${safeSubject} — from ${safeName}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#3F3E7A;border-bottom:1px solid #eee;padding-bottom:12px">
            New Contact Form Submission
          </h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#666;width:120px">Name</td><td style="padding:8px 0"><strong>${safeName}</strong></td></tr>
            <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0">${safeEmail ? `<a href="mailto:${safeEmail}">${safeEmail}</a>` : '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0">${safePhone}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Subject</td><td style="padding:8px 0">${safeSubject}</td></tr>
          </table>
          <div style="margin-top:20px">
            <p style="color:#666;margin-bottom:8px">Message:</p>
            <div style="background:#f9f9f9;padding:16px;border-left:3px solid #3F3E7A;white-space:pre-wrap">${safeMessage}</div>
          </div>
        </div>
      `,
    })

    return Response.json({ success: true })
  } catch (err) {
    console.error('Resend error:', err)
    return Response.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}

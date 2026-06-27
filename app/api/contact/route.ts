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

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'

  let body: Record<string, string>
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { name, email, phone, subject, message, website } = body

  // Honeypot — silent accept so bots don't know they were blocked
  if (website) {
    return Response.json({ success: true })
  }

  // Validation
  const errors: string[] = []
  if (!name?.trim()) errors.push('Name is required.')
  if (name && name.length > 100) errors.push('Name must be under 100 characters.')
  if (!email?.trim() || !EMAIL_RE.test(email)) errors.push('A valid email is required.')
  if (!phone?.trim()) errors.push('Phone is required.')
  if (!subject?.trim()) errors.push('Subject is required.')
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

  const to = process.env.EMAIL_TO
  if (!to) {
    console.error('EMAIL_TO env variable is not set')
    return Response.json({ error: 'Server configuration error.' }, { status: 500 })
  }

  try {
    await resend.emails.send({
      from: 'Elite Handpan <onboarding@resend.dev>',
      to,
      subject: `[Elite Handpan] ${subject} — from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#C9A84C;border-bottom:1px solid #eee;padding-bottom:12px">
            New Contact Form Submission
          </h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#666;width:120px">Name</td><td style="padding:8px 0"><strong>${name}</strong></td></tr>
            <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0">${phone}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Subject</td><td style="padding:8px 0">${subject}</td></tr>
          </table>
          <div style="margin-top:20px">
            <p style="color:#666;margin-bottom:8px">Message:</p>
            <div style="background:#f9f9f9;padding:16px;border-left:3px solid #C9A84C;white-space:pre-wrap">${message}</div>
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

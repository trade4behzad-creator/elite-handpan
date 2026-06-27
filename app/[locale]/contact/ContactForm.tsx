'use client'

import { useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

type Status = 'idle' | 'loading' | 'success' | 'error'

const inputClass =
  'border border-gray-200 px-4 py-3 w-full focus:border-[#C9A84C] outline-none text-sm text-[#111] bg-white transition-colors'

const infoItems = [
  { icon: '◉', label: 'Email', value: 'info@elitehandpan.com', href: 'mailto:info@elitehandpan.com' },
  { icon: '◉', label: 'Phone', value: '+98 900 000 0000', href: 'tel:+989000000000' },
  { icon: '◉', label: 'WhatsApp', value: 'Chat on WhatsApp', href: 'https://wa.me/989000000000' },
  { icon: '◉', label: 'Instagram', value: '@elitehandpan', href: 'https://instagram.com/elitehandpan' },
  { icon: '◉', label: 'Address', value: 'Tehran, Iran', href: null },
]

export default function ContactForm() {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', phone: '', subject: '', message: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const formData = new FormData(e.currentTarget)
    const payload = Object.fromEntries(formData.entries())

    const recaptchaToken = executeRecaptcha
      ? await executeRecaptcha('contact_form')
      : ''

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, recaptchaToken }),
      })
      const data = await res.json()

      if (data.success) {
        setStatus('success')
        setForm({ name: '', email: '', phone: '', subject: '', message: '' })
      } else {
        setStatus('error')
        setErrorMsg(data.error ?? 'Something went wrong.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please try again.')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto px-8 py-24">

      {/* Left — Form */}
      <div>
        {status === 'success' ? (
          <div className="flex flex-col items-start gap-4 py-12">
            <span className="text-3xl text-green-500">✓</span>
            <p
              className="text-xl text-[#111]"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              Message sent successfully.
            </p>
            <p className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-inter)' }}>
              We&apos;ll get back to you as soon as possible.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-4 text-xs tracking-widest uppercase text-[#C9A84C] border border-[#C9A84C] px-4 py-2 hover:bg-[#C9A84C] hover:text-black transition-colors"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {/* Honeypot */}
            <input name="website" tabIndex={-1} style={{ display: 'none' }} autoComplete="off" />

            <div className="flex flex-col gap-4">
              <input
                name="name"
                type="text"
                placeholder="Name *"
                value={form.name}
                onChange={handleChange}
                required
                maxLength={100}
                className={inputClass}
                style={{ fontFamily: 'var(--font-inter)' }}
              />
              <input
                name="email"
                type="email"
                placeholder="Email *"
                value={form.email}
                onChange={handleChange}
                required
                className={inputClass}
                style={{ fontFamily: 'var(--font-inter)' }}
              />
              <input
                name="phone"
                type="tel"
                placeholder="Phone *"
                value={form.phone}
                onChange={handleChange}
                required
                className={inputClass}
                style={{ fontFamily: 'var(--font-inter)' }}
              />
              <select
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                className={`${inputClass} text-gray-500`}
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                <option value="" disabled>Subject *</option>
                <option value="Instrument Inquiry">Instrument Inquiry</option>
                <option value="Order Status">Order Status</option>
                <option value="Warranty">Warranty</option>
                <option value="Other">Other</option>
              </select>
              <textarea
                name="message"
                placeholder="Message *"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                maxLength={2000}
                className={`${inputClass} resize-none`}
                style={{ fontFamily: 'var(--font-inter)' }}
              />

              {status === 'error' && (
                <p className="text-red-500 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-[#C9A84C] hover:bg-[#b8943e] disabled:opacity-60 text-black text-sm tracking-widest uppercase py-4 transition-colors"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {status === 'loading' ? 'Sending…' : 'Send Message'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Right — Info */}
      <div>
        <h2
          className="text-2xl font-light text-[#111]"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          Our Information
        </h2>
        <div className="w-10 h-px bg-[#C9A84C] mt-2 mb-8" />

        <ul className="flex flex-col gap-5 mb-10">
          {infoItems.map((item) => (
            <li key={item.label} className="flex items-start gap-3">
              <span className="text-[#C9A84C] mt-0.5 text-sm">◉</span>
              <div>
                <p
                  className="text-xs text-gray-400 uppercase tracking-widest mb-0.5"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-sm text-[#111] hover:text-[#C9A84C] transition-colors"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm text-[#111]" style={{ fontFamily: 'var(--font-inter)' }}>
                    {item.value}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* Google Maps — Tehran */}
        <div className="w-full rounded-sm overflow-hidden border border-gray-100">
          <iframe
            title="Elite Handpan — Tehran"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d414099.4847495478!2d50.85204897440697!3d35.69938784720736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e00491ff3dcd9%3A0xf0b3697c567d4bef!2sTehran%2C%20Tehran%20Province%2C%20Iran!5e0!3m2!1sen!2s!4v1719000000000!5m2!1sen!2s"
            width="100%"
            height="260"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  )
}

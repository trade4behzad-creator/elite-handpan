'use client'

import { useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

type Status = 'idle' | 'loading' | 'success' | 'error'

const inputClass =
  'border border-gray-200 px-4 py-3 w-full focus:border-[#3F3E7A] outline-none text-sm text-[#111] bg-white transition-colors'

export default function ContactForm({ locale }: { locale: string }) {
  const isFa = locale === 'fa'
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', phone: '', subject: '', message: '',
  })

  const infoItems = [
    { icon: '◉', label: isFa ? 'ایمیل' : 'Email', value: 'info@elitehandpan.com', href: 'mailto:info@elitehandpan.com' },
    { icon: '◉', label: isFa ? 'تلفن' : 'Phone', value: '+98 900 000 0000', href: 'tel:+989000000000' },
    { icon: '◉', label: 'WhatsApp', value: isFa ? 'گفتگو در واتساپ' : 'Chat on WhatsApp', href: 'https://wa.me/989000000000' },
    { icon: '◉', label: isFa ? 'اینستاگرام' : 'Instagram', value: '@elitehandpan', href: 'https://instagram.com/elitehandpan' },
    { icon: '◉', label: isFa ? 'آدرس' : 'Address', value: isFa ? 'تهران، ایران' : 'Tehran, Iran', href: null },
  ]

  const subjectOptions = [
    { value: 'Instrument Inquiry', label: isFa ? 'استعلام ساز' : 'Instrument Inquiry' },
    { value: 'Order Status', label: isFa ? 'وضعیت سفارش' : 'Order Status' },
    { value: 'Warranty', label: isFa ? 'گارانتی' : 'Warranty' },
    { value: 'Other', label: isFa ? 'سایر' : 'Other' },
  ]

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    if (name === 'phone') {
      // Only allow digits, spaces, +, -, and parentheses — strips anything else as you type
      setForm((prev) => ({ ...prev, phone: value.replace(/[^0-9+\-\s()]/g, '') }))
      return
    }
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    if (!executeRecaptcha) {
      setStatus('error')
      setErrorMsg(
        isFa
          ? 'در حال آماده‌سازی امنیتی صفحه هستیم، چند ثانیه صبر کنید و دوباره امتحان کنید.'
          : 'Security check is still loading — please wait a moment and try again.'
      )
      return
    }

    const formData = new FormData(e.currentTarget)
    const payload = Object.fromEntries(formData.entries())

    const recaptchaToken = await executeRecaptcha('contact_form')

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
        setErrorMsg(data.error ?? (isFa ? 'مشکلی پیش آمد.' : 'Something went wrong.'))
      }
    } catch {
      setStatus('error')
      setErrorMsg(isFa ? 'خطای شبکه. دوباره تلاش کنید.' : 'Network error. Please try again.')
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
              {isFa ? 'پیام شما با موفقیت ارسال شد.' : 'Message sent successfully.'}
            </p>
            <p className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-inter)' }}>
              {isFa ? 'در اسرع وقت با شما تماس خواهیم گرفت.' : "We'll get back to you as soon as possible."}
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-4 text-xs tracking-widest uppercase text-[#3F3E7A] border border-[#3F3E7A] px-4 py-2 hover:bg-[#3F3E7A] hover:text-black transition-colors"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {isFa ? 'ارسال پیام دیگر' : 'Send another'}
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
                placeholder={isFa ? 'نام *' : 'Name *'}
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
                placeholder={isFa ? 'ایمیل (اختیاری)' : 'Email (optional)'}
                value={form.email}
                onChange={handleChange}
                className={inputClass}
                style={{ fontFamily: 'var(--font-inter)' }}
              />
              <input
                name="phone"
                type="tel"
                placeholder={isFa ? 'تلفن *' : 'Phone *'}
                value={form.phone}
                onChange={handleChange}
                required
                pattern="[0-9+\-\s()]{6,20}"
                title="Numbers, spaces, +, - and () only"
                maxLength={20}
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
                <option value="" disabled>{isFa ? 'موضوع *' : 'Subject *'}</option>
                {subjectOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <textarea
                name="message"
                placeholder={isFa ? 'پیام *' : 'Message *'}
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
                className="w-full bg-[#3F3E7A] hover:bg-[#b8943e] disabled:opacity-60 text-black text-sm tracking-widest uppercase py-4 transition-colors"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {status === 'loading' ? (isFa ? 'در حال ارسال…' : 'Sending…') : (isFa ? 'ارسال پیام' : 'Send Message')}
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
          {isFa ? 'اطلاعات تماس' : 'Our Information'}
        </h2>
        <div className="w-10 h-px bg-[#3F3E7A] mt-2 mb-8" />

        <ul className="flex flex-col gap-5 mb-10">
          {infoItems.map((item) => (
            <li key={item.label} className="flex items-start gap-3">
              <span className="text-[#3F3E7A] mt-0.5 text-sm">◉</span>
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
                    className="text-sm text-[#111] hover:text-[#3F3E7A] transition-colors"
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
      </div>
    </div>
  )
}

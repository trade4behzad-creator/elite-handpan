'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function formatPhone(phone: string) {
  return `${phone.trim()}@elitehandpan.com`
}

const inputClass =
  'w-full bg-[#fafafa] border border-gray-200 text-[#111] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C] transition-colors rounded-[3px]'

export default function AuthForm({ locale }: { locale: string }) {
  const router = useRouter()
  const isFA = locale === 'fa'

  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function switchMode() {
    setMode(mode === 'login' ? 'signup' : 'login')
    setError(null)
    setPhone('')
    setPassword('')
    setConfirmPassword('')
    setName('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const fakeEmail = formatPhone(phone)

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError(isFA ? 'رمز عبور و تکرار آن یکسان نیستند' : 'Passwords do not match')
        return
      }
      if (phone.trim().length < 10) {
        setError(isFA ? 'شماره موبایل معتبر نیست' : 'Invalid phone number')
        return
      }
    }

    setLoading(true)

    if (mode === 'login') {
      const { error: authErr } = await supabase.auth.signInWithPassword({ email: fakeEmail, password })
      if (authErr) {
        setError(isFA ? 'شماره موبایل یا رمز عبور اشتباه است' : 'Invalid phone number or password')
        setLoading(false)
        return
      }
      router.push(`/${locale}/profile`)
    } else {
      const { data, error: authErr } = await supabase.auth.signUp({
        email: fakeEmail,
        password,
        options: { data: { full_name: name, phone: phone.trim() } },
      })
      if (authErr) {
        setError(isFA ? 'خطا در ثبت‌نام: ' + authErr.message : 'Sign up error: ' + authErr.message)
        setLoading(false)
        return
      }
      if (data.user) {
        await supabase.from('profiles').upsert({
          user_id: data.user.id,
          full_name: name,
          phone: phone.trim(),
        })
      }
      router.push(`/${locale}/profile`)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-white px-4 py-16 md:py-24">
      <div className="bg-white border border-gray-100 rounded-md shadow-[0_2px_30px_rgba(0,0,0,0.06)] max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left: image */}
        <div className="relative hidden md:block min-h-[560px]">
          <img
            src="/images/about-page/hero.jpg"
            alt="Elite Handpan craftsmanship"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(160deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 55%, rgba(0,0,0,0.5) 100%)' }}
          />
          <div className="absolute bottom-10 left-8 right-8">
            <p
              className="text-white/90 text-lg font-light italic leading-relaxed"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              {isFA ? '«جایی که فلز به زبان فرکانس سخن می‌گوید»' : '“Where metal speaks in frequencies”'}
            </p>
          </div>
        </div>

        {/* Right: form */}
        <div className="px-8 py-12 md:px-12 md:py-16 flex flex-col justify-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src="/images/logo.png" alt="Elite Handpan" style={{ height: '48px', width: 'auto' }} />
          </div>

          <p
            className="text-[#C9A84C] text-xs tracking-widest uppercase text-center mb-3"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            ELITE HANDPAN
          </p>

          <h1
            className="text-4xl font-light text-[#111] text-center"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {mode === 'login'
              ? (isFA ? 'ورود' : 'Sign In')
              : (isFA ? 'ثبت‌نام' : 'Create Account')}
          </h1>
          <p
            className="text-gray-400 text-xs text-center mt-2 mb-7"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {mode === 'login'
              ? (isFA ? 'به دنیای صنعتگری خوش آمدید' : 'Welcome back to the craft')
              : (isFA ? 'به جمع علاقه‌مندان الیت بپیوندید' : 'Join the Elite collectors circle')}
          </p>

          <div className="mb-7 h-px w-12 bg-[#C9A84C] opacity-60 mx-auto" />

          {error && (
            <div
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm text-red-500 text-sm"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {mode === 'signup' && (
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-500 tracking-wide" style={{ fontFamily: 'var(--font-inter)' }}>
                  {isFA ? 'نام کامل' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={inputClass}
                  style={{ fontFamily: 'var(--font-vazirmatn), Arial, sans-serif' }}
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-500 tracking-wide" style={{ fontFamily: 'var(--font-inter)' }}>
                {isFA ? 'شماره موبایل' : 'Phone Number'}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="09123456789"
                className={inputClass}
                style={{ fontFamily: 'var(--font-inter)', direction: 'ltr' }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-500 tracking-wide" style={{ fontFamily: 'var(--font-inter)' }}>
                {isFA ? 'رمز عبور' : 'Password'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className={inputClass}
                style={{ fontFamily: 'var(--font-inter)', direction: 'ltr' }}
              />
            </div>

            {mode === 'signup' && (
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-500 tracking-wide" style={{ fontFamily: 'var(--font-inter)' }}>
                  {isFA ? 'تکرار رمز عبور' : 'Confirm Password'}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className={inputClass}
                  style={{ fontFamily: 'var(--font-inter)', direction: 'ltr' }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3 rounded-sm text-sm tracking-widest uppercase transition-opacity"
              style={{
                background: loading ? '#b8973e' : '#C9A84C',
                color: '#000',
                fontFamily: 'var(--font-inter)',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                border: 'none',
              }}
            >
              {loading
                ? (isFA ? 'لطفاً صبر کنید...' : 'Please wait...')
                : (isFA ? 'ادامه' : 'Continue')}
            </button>
          </form>

          <button
            type="button"
            onClick={switchMode}
            className="mt-6 w-full text-center text-sm text-gray-400 hover:text-[#C9A84C] transition-colors"
            style={{ fontFamily: 'var(--font-inter)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {mode === 'login'
              ? (isFA ? 'حساب کاربری ندارید؟ ثبت‌نام کنید' : "Don't have an account? Sign up")
              : (isFA ? 'حساب دارید؟ وارد شوید' : 'Already have an account? Sign in')}
          </button>
        </div>
      </div>
    </div>
  )
}

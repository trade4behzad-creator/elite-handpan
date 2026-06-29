'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function formatPhone(phone: string) {
  return `${phone.trim()}@elitehandpan.com`
}

const inputClass =
  'w-full bg-[#1a1a1a] border border-[#333] text-white px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C] transition-colors rounded-[4px]'

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
    <div className="flex-1 flex items-center justify-center px-6 py-24">
      <div className="bg-[#111] border border-[#222] rounded-sm p-10 max-w-md w-full">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src="/images/logo.png" alt="Elite Handpan" style={{ height: '60px', width: 'auto' }} />
        </div>

        {/* Eyebrow */}
        <p
          className="text-[#C9A84C] text-xs tracking-widest uppercase text-center mb-4"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          ELITE HANDPAN
        </p>

        {/* Heading */}
        <h1
          className="text-4xl font-light text-white text-center"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          {mode === 'login'
            ? (isFA ? 'ورود' : 'Sign In')
            : (isFA ? 'ثبت‌نام' : 'Create Account')}
        </h1>

        {/* Gold divider */}
        <div className="mt-5 mb-8 h-px w-12 bg-[#C9A84C] opacity-60 mx-auto" />

        {error && (
          <div
            className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-sm text-red-400 text-sm"
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
            className="mt-2 w-full py-3 rounded-sm text-sm tracking-widest uppercase"
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
          className="mt-6 w-full text-center text-sm text-gray-500 hover:text-[#C9A84C] transition-colors"
          style={{ fontFamily: 'var(--font-inter)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {mode === 'login'
            ? (isFA ? 'حساب کاربری ندارید؟ ثبت‌نام کنید' : "Don't have an account? Sign up")
            : (isFA ? 'حساب دارید؟ وارد شوید' : 'Already have an account? Sign in')}
        </button>
      </div>
    </div>
  )
}

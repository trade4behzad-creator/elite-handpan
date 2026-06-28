'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const GOLD = '#C9A84C'

function formatPhone(phone: string) {
  const cleaned = phone.trim()
  return `${cleaned}@elitehandpan.com`
}

const inputClass =
  'w-full px-4 py-3 border border-gray-200 rounded-[4px] text-sm text-[#111] focus:outline-none focus:border-[#C9A84C] transition-colors'

export default function AuthPage() {
  const params = useParams<{ locale: string }>()
  const locale = params?.locale ?? 'en'
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
      const { error: authErr } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password,
      })
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
    <div className="min-h-screen bg-white flex flex-col" dir={isFA ? 'rtl' : 'ltr'}>
      {/* Top bar */}
      <div className="px-8 py-6 flex items-center justify-between border-b border-gray-100">
        <Link
          href={`/${locale}`}
          className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Elite Handpan
        </Link>
        <Link
          href={`/${locale}`}
          className="text-gray-400 text-sm hover:text-gray-600 transition-colors"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          {isFA ? 'بازگشت به خانه' : 'Back to home'}
        </Link>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="mb-10">
            <p
              className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-4"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {isFA ? 'حساب کاربری' : 'Account'}
            </p>
            <h1
              className="text-4xl font-light text-[#111111]"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              {mode === 'login'
                ? (isFA ? 'ورود' : 'Sign In')
                : (isFA ? 'ثبت‌نام' : 'Sign Up')}
            </h1>
            <div className="mt-5 h-px w-12 bg-[#C9A84C] opacity-60" />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[4px] text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Full name — signup only */}
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

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-500 tracking-wide" style={{ fontFamily: 'var(--font-inter)' }}>
                {isFA ? 'شماره موبایل' : 'Phone Number'}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder={isFA ? '09123456789' : '09123456789'}
                className={inputClass}
                style={{ fontFamily: 'var(--font-inter)', direction: 'ltr' }}
              />
            </div>

            {/* Password */}
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

            {/* Confirm password — signup only */}
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
              className="mt-2 w-full py-3 rounded-[4px] text-sm font-semibold tracking-wide"
              style={{
                background: loading ? '#b8973e' : GOLD,
                color: '#0a0a0a',
                fontFamily: 'var(--font-inter)',
                cursor: loading ? 'not-allowed' : 'pointer',
                border: 'none',
              }}
            >
              {loading ? (isFA ? 'لطفاً صبر کنید...' : 'Please wait...') : (isFA ? 'ادامه' : 'Continue')}
            </button>
          </form>

          <button
            type="button"
            onClick={switchMode}
            className="mt-6 w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
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

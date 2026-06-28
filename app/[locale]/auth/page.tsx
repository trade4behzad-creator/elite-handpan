'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const GOLD = '#C9A84C'

export default function AuthPage() {
  const params = useParams<{ locale: string }>()
  const locale = params?.locale ?? 'en'
  const router = useRouter()

  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const isFA = locale === 'fa'

  const t = {
    login: isFA ? 'ورود' : 'Sign In',
    signup: isFA ? 'ثبت‌نام' : 'Sign Up',
    email: isFA ? 'ایمیل' : 'Email',
    password: isFA ? 'رمز عبور' : 'Password',
    name: isFA ? 'نام' : 'Full Name',
    submit: isFA ? 'ادامه' : 'Continue',
    switchToSignup: isFA ? 'حساب کاربری ندارید؟ ثبت‌نام کنید' : "Don't have an account? Sign up",
    switchToLogin: isFA ? 'حساب دارید؟ وارد شوید' : 'Already have an account? Sign in',
    signupSuccess: isFA
      ? 'ثبت‌نام موفق! ایمیل تأیید را بررسی کنید.'
      : 'Registered! Check your email to confirm.',
    backToHome: isFA ? 'بازگشت به خانه' : 'Back to home',
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    if (mode === 'login') {
      const { error: authErr } = await supabase.auth.signInWithPassword({ email, password })
      if (authErr) {
        setError(isFA ? 'ایمیل یا رمز عبور اشتباه است' : 'Invalid email or password')
        setLoading(false)
        return
      }
      router.push(`/${locale}/profile`)
    } else {
      const { error: authErr } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      })
      if (authErr) {
        setError(authErr.message)
        setLoading(false)
        return
      }
      setSuccess(t.signupSuccess)
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-white flex flex-col"
      dir={isFA ? 'rtl' : 'ltr'}
    >
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
          {t.backToHome}
        </Link>
      </div>

      {/* Form card */}
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-md">
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
              {mode === 'login' ? t.login : t.signup}
            </h1>
            <div className="mt-5 h-px w-12 bg-[#C9A84C] opacity-60" />
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {mode === 'signup' && (
              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-500 tracking-wide" style={{ fontFamily: 'var(--font-inter)' }}>
                  {t.name}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-[4px] text-sm text-[#111] focus:outline-none focus:border-[#C9A84C] transition-colors"
                  style={{ fontFamily: 'var(--font-inter)', direction: 'ltr' }}
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-500 tracking-wide" style={{ fontFamily: 'var(--font-inter)' }}>
                {t.email}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-[4px] text-sm text-[#111] focus:outline-none focus:border-[#C9A84C] transition-colors"
                style={{ fontFamily: 'var(--font-inter)', direction: 'ltr' }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-500 tracking-wide" style={{ fontFamily: 'var(--font-inter)' }}>
                {t.password}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-[4px] text-sm text-[#111] focus:outline-none focus:border-[#C9A84C] transition-colors"
                style={{ fontFamily: 'var(--font-inter)', direction: 'ltr' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3 rounded-[4px] text-sm font-semibold tracking-wide transition-opacity"
              style={{
                background: loading ? '#b8973e' : GOLD,
                color: '#0a0a0a',
                fontFamily: 'var(--font-inter)',
                cursor: loading ? 'not-allowed' : 'pointer',
                border: 'none',
              }}
            >
              {loading ? '...' : t.submit}
            </button>
          </form>

          <button
            type="button"
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); setSuccess(null) }}
            className="mt-6 w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
            style={{ fontFamily: 'var(--font-inter)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {mode === 'login' ? t.switchToSignup : t.switchToLogin}
          </button>
        </div>
      </div>
    </div>
  )
}

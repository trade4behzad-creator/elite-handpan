import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

async function loginAction(formData: FormData) {
  'use server'
  const password = formData.get('password') as string
  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies()
    cookieStore.set('admin_auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    redirect('/admin/dashboard')
  }
  redirect('/admin?error=1')
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const hasError = params.error === '1'

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '48px 40px',
          background: '#111',
          border: '1px solid #1e1e1e',
          borderRadius: '8px',
        }}
      >
        {/* Logo / Title */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p
            style={{
              color: '#C9A84C',
              fontSize: '11px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Elite Handpan
          </p>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: '300',
              color: '#f5f5f5',
              margin: 0,
            }}
          >
            پنل مدیریت
          </h1>
          <div
            style={{
              width: '40px',
              height: '1px',
              background: '#C9A84C',
              margin: '20px auto 0',
              opacity: 0.6,
            }}
          />
        </div>

        {/* Error message */}
        {hasError && (
          <div
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '4px',
              padding: '12px 16px',
              marginBottom: '24px',
              color: '#f87171',
              fontSize: '14px',
              textAlign: 'center',
            }}
          >
            رمز عبور اشتباه است
          </div>
        )}

        {/* Login form */}
        <form action={loginAction} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontSize: '13px',
                color: '#888',
                marginBottom: '8px',
              }}
            >
              رمز عبور
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#0a0a0a',
                border: '1px solid #2a2a2a',
                borderRadius: '4px',
                color: '#f5f5f5',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '13px',
              background: '#C9A84C',
              color: '#0a0a0a',
              border: 'none',
              borderRadius: '4px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '8px',
              fontFamily: 'var(--font-vazirmatn), Arial, sans-serif',
            }}
          >
            ورود
          </button>
        </form>
      </div>
    </main>
  )
}

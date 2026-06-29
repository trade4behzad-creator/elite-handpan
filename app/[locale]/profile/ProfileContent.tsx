'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import Footer from '../../components/Footer'

type Profile = {
  full_name: string | null
  phone: string | null
}

type Order = {
  id: string
  created_at: string
  status: string
  total_usd: number | null
  total_fa: number | null
}

const STATUS_LABELS: Record<string, { en: string; fa: string; color: string; stage: number }> = {
  pending:   { en: 'Pending',   fa: 'در انتظار',      color: '#f59e0b', stage: 1 },
  confirmed: { en: 'Confirmed', fa: 'تأیید شده',      color: '#3b82f6', stage: 2 },
  shipped:   { en: 'Shipped',   fa: 'ارسال شده',      color: '#8b5cf6', stage: 3 },
  delivered: { en: 'Delivered', fa: 'تحویل داده شده', color: '#22c55e', stage: 4 },
  cancelled: { en: 'Cancelled', fa: 'لغو شده',        color: '#ef4444', stage: 0 },
}

const STAGES = ['pending', 'confirmed', 'shipped', 'delivered']

function formatDate(iso: string, isFA: boolean) {
  return new Date(iso).toLocaleDateString(isFA ? 'fa-IR' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

function getInitials(name: string | null) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function ProfileContent({ locale }: { locale: string }) {
  const router = useRouter()
  const isFA = locale === 'fa'

  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) {
        router.push(`/${locale}/auth`)
        return
      }
      setUser(u)

      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('user_id', u.id)
        .single()

      setProfile(profileData as Profile | null)

      const { data: ordersData } = await supabase
        .from('orders')
        .select('id, created_at, status, total_usd, total_fa')
        .eq('user_id', u.id)
        .order('created_at', { ascending: false })

      setOrders((ordersData ?? []) as Order[])
      setLoading(false)
    }
    load()
  }, [locale, router])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push(`/${locale}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
          {isFA ? 'در حال بارگذاری...' : 'Loading...'}
        </p>
      </div>
    )
  }

  const displayName = profile?.full_name ?? user?.user_metadata?.full_name ?? null
  const displayPhone = profile?.phone ?? user?.user_metadata?.phone ?? null

  return (
    <>
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-8">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-10">
        {/* Left: User info card */}
        <div className="border border-gray-200 rounded-sm p-6 flex flex-col gap-6 self-start">
          {/* Avatar */}
          <div className="flex justify-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-medium"
              style={{
                background: '#C9A84C',
                color: '#000',
                fontFamily: 'var(--font-inter)',
              }}
            >
              {getInitials(displayName)}
            </div>
          </div>

          {/* Name & phone */}
          <div className="flex flex-col gap-4">
            {displayName && (
              <div>
                <p className="text-xs text-gray-400 mb-1 tracking-wide" style={{ fontFamily: 'var(--font-inter)' }}>
                  {isFA ? 'نام کامل' : 'Full Name'}
                </p>
                <p className="text-[#111] text-sm font-medium" style={{ fontFamily: 'var(--font-vazirmatn), Arial, sans-serif' }}>
                  {displayName}
                </p>
              </div>
            )}
            {displayPhone && (
              <div>
                <p className="text-xs text-gray-400 mb-1 tracking-wide" style={{ fontFamily: 'var(--font-inter)' }}>
                  {isFA ? 'شماره موبایل' : 'Phone Number'}
                </p>
                <p className="text-[#111] text-sm" style={{ fontFamily: 'var(--font-inter)', direction: 'ltr' }}>
                  {displayPhone}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              className="w-full py-2 text-sm tracking-wide border rounded-sm transition-colors"
              style={{
                fontFamily: 'var(--font-inter)',
                color: '#C9A84C',
                borderColor: '#C9A84C',
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              {isFA ? 'ویرایش پروفایل' : 'Edit Profile'}
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full py-2 text-sm text-red-400 hover:text-red-500 transition-colors"
              style={{ fontFamily: 'var(--font-inter)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {isFA ? 'خروج از حساب' : 'Sign Out'}
            </button>
          </div>
        </div>

        {/* Right: Orders */}
        <div>
          <h2
            className="text-3xl font-light text-[#111] mb-6"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {isFA ? 'سفارش‌های من' : 'My Orders'}
          </h2>

          {orders.length === 0 ? (
            <div className="py-16 text-center border border-gray-100 rounded-sm flex flex-col items-center gap-4">
              <span style={{ color: '#C9A84C', fontSize: '2rem', lineHeight: 1 }}>◉</span>
              <p className="text-gray-400 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                {isFA ? 'هنوز سفارشی ثبت نشده' : 'No orders yet'}
              </p>
              <Link
                href={`/${locale}/shop/handpan`}
                className="text-sm border px-5 py-2 rounded-sm transition-colors hover:bg-[#C9A84C]/5"
                style={{
                  color: '#C9A84C',
                  borderColor: '#C9A84C40',
                  fontFamily: 'var(--font-inter)',
                }}
              >
                {isFA ? 'مشاهده سازها' : 'Browse Instruments'}
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order) => {
                const statusInfo = STATUS_LABELS[order.status] ?? {
                  en: order.status, fa: order.status, color: '#888', stage: 0,
                }
                const progressPct = statusInfo.stage === 0 ? 0 : (statusInfo.stage / 4) * 100

                return (
                  <div key={order.id} className="border border-gray-100 rounded-sm p-6">
                    {/* Top row: instrument + date + status */}
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div>
                        <p
                          className="text-base font-light text-[#111] mb-1"
                          style={{ fontFamily: 'var(--font-cormorant)' }}
                        >
                          {isFA ? 'هندپن الیت' : 'Elite Handpan'}
                        </p>
                        <p className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-inter)' }}>
                          #{order.id.slice(0, 8).toUpperCase()} · {formatDate(order.created_at, isFA)}
                        </p>
                      </div>
                      <span
                        className="text-xs px-3 py-1 rounded-full shrink-0"
                        style={{
                          color: statusInfo.color,
                          background: `${statusInfo.color}18`,
                          fontFamily: 'var(--font-inter)',
                        }}
                      >
                        {isFA ? statusInfo.fa : statusInfo.en}
                      </span>
                    </div>

                    {/* Progress bar */}
                    {order.status !== 'cancelled' && (
                      <div className="mb-5">
                        <div className="flex justify-between text-[10px] text-gray-400 mb-2" style={{ fontFamily: 'var(--font-inter)' }}>
                          {STAGES.map((s) => (
                            <span
                              key={s}
                              style={{ color: STATUS_LABELS[s].stage <= statusInfo.stage ? '#C9A84C' : undefined }}
                            >
                              {isFA ? STATUS_LABELS[s].fa : STATUS_LABELS[s].en}
                            </span>
                          ))}
                        </div>
                        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${progressPct}%`, background: '#C9A84C' }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Payment */}
                    {(order.total_usd || order.total_fa) && (
                      <div className="pt-4 border-t border-gray-50">
                        <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'var(--font-inter)' }}>
                          {isFA ? 'مبلغ' : 'Amount'}
                        </p>
                        <p className="text-sm font-medium" style={{ color: '#C9A84C', fontFamily: 'var(--font-inter)' }}>
                          {isFA && order.total_fa
                            ? `${Number(order.total_fa).toLocaleString('en-US')} تومان`
                            : `$${Number(order.total_usd).toLocaleString()}`}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
    <Footer />
  </>
  )
}

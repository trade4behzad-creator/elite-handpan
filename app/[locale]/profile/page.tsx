'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

const GOLD = '#C9A84C'

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

const STATUS_LABELS: Record<string, { en: string; fa: string; color: string }> = {
  pending:   { en: 'Pending',   fa: 'در انتظار',      color: '#f59e0b' },
  confirmed: { en: 'Confirmed', fa: 'تأیید شده',      color: '#3b82f6' },
  shipped:   { en: 'Shipped',   fa: 'ارسال شده',      color: '#8b5cf6' },
  delivered: { en: 'Delivered', fa: 'تحویل داده شده', color: '#22c55e' },
  cancelled: { en: 'Cancelled', fa: 'لغو شده',        color: '#ef4444' },
}

function formatDate(iso: string, isFA: boolean) {
  return new Date(iso).toLocaleDateString(isFA ? 'fa-IR' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

export default function ProfilePage() {
  const params = useParams<{ locale: string }>()
  const locale = params?.locale ?? 'en'
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
      <div className="min-h-screen bg-white flex items-center justify-center" dir={isFA ? 'rtl' : 'ltr'}>
        <p className="text-gray-400 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
          {isFA ? 'در حال بارگذاری...' : 'Loading...'}
        </p>
      </div>
    )
  }

  const displayName = profile?.full_name ?? user?.user_metadata?.full_name ?? null
  const displayPhone = profile?.phone ?? user?.user_metadata?.phone ?? null

  return (
    <div className="min-h-screen bg-white" dir={isFA ? 'rtl' : 'ltr'}>
      {/* Top bar */}
      <div className="px-8 py-6 flex items-center justify-between border-b border-gray-100">
        <Link
          href={`/${locale}`}
          className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Elite Handpan
        </Link>
        <button
          onClick={handleSignOut}
          className="text-gray-400 text-sm hover:text-gray-600 transition-colors"
          style={{ fontFamily: 'var(--font-inter)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {isFA ? 'خروج' : 'Sign Out'}
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="mb-12">
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
            {isFA ? 'پروفایل' : 'Profile'}
          </h1>
          <div className="mt-5 h-px w-12 bg-[#C9A84C] opacity-60" />
        </div>

        {/* User info card */}
        <div className="mb-12 p-6 border border-gray-100 rounded-[4px] flex flex-col gap-4">
          {displayName && (
            <div>
              <p className="text-xs text-gray-400 mb-1 tracking-wide" style={{ fontFamily: 'var(--font-inter)' }}>
                {isFA ? 'نام کامل' : 'Full Name'}
              </p>
              <p className="text-[#111] text-sm" style={{ fontFamily: 'var(--font-vazirmatn), Arial, sans-serif' }}>
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

        {/* Orders */}
        <div>
          <h2
            className="text-2xl font-light text-[#111111] mb-6"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {isFA ? 'سفارش‌های من' : 'My Orders'}
          </h2>

          {orders.length === 0 ? (
            <div className="py-16 text-center border border-gray-100 rounded-[4px]">
              <p className="text-gray-400 text-sm mb-4" style={{ fontFamily: 'var(--font-inter)' }}>
                {isFA ? 'هیچ سفارشی ثبت نشده' : 'No orders yet'}
              </p>
              <Link
                href={`/${locale}/shop/handpan`}
                className="text-sm text-[#C9A84C] border border-[#C9A84C]/40 px-5 py-2 rounded-[4px] hover:bg-[#C9A84C]/5 transition-colors"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {isFA ? 'مشاهده محصولات' : 'Browse Products'}
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order) => {
                const statusInfo = STATUS_LABELS[order.status] ?? { en: order.status, fa: order.status, color: '#888' }
                return (
                  <div
                    key={order.id}
                    className="p-5 border border-gray-100 rounded-[4px] flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'var(--font-inter)' }}>
                        {formatDate(order.created_at, isFA)}
                      </p>
                      <p className="text-sm text-[#111]" style={{ fontFamily: 'var(--font-inter)', direction: 'ltr' }}>
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {(order.total_usd || order.total_fa) && (
                        <span className="text-sm font-medium" style={{ color: GOLD, fontFamily: 'var(--font-inter)' }}>
                          {isFA && order.total_fa
                            ? `${Number(order.total_fa).toLocaleString('en-US')} تومان`
                            : `$${Number(order.total_usd).toLocaleString()}`}
                        </span>
                      )}
                      <span
                        className="text-xs px-3 py-1 rounded-full"
                        style={{
                          color: statusInfo.color,
                          background: `${statusInfo.color}18`,
                          fontFamily: 'var(--font-inter)',
                        }}
                      >
                        {isFA ? statusInfo.fa : statusInfo.en}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

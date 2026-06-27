'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/admin/dashboard', label: 'داشبورد', icon: '◈' },
  { href: '/admin/dashboard/products', label: 'محصولات هندپن', icon: '◎' },
  { href: '/admin/dashboard/accessories', label: 'اکسسوری', icon: '◇' },
  { href: '/admin/dashboard/messages', label: 'پیام‌ها', icon: '◻' },
  { href: '/admin/dashboard/settings', label: 'تنظیمات', icon: '⊙' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside
      style={{
        width: '240px',
        minHeight: '100vh',
        background: '#111',
        borderLeft: '1px solid #1e1e1e',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      {/* Brand */}
      <div
        style={{
          padding: '28px 24px',
          borderBottom: '1px solid #1e1e1e',
        }}
      >
        <p
          style={{
            color: '#C9A84C',
            fontSize: '10px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            margin: '0 0 6px',
          }}
        >
          Elite Handpan
        </p>
        <h2 style={{ fontSize: '16px', fontWeight: '400', color: '#f5f5f5', margin: 0 }}>
          پنل مدیریت
        </h2>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 0' }}>
        {navItems.map((item) => {
          const isActive =
            item.href === '/admin/dashboard'
              ? pathname === item.href
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 24px',
                color: isActive ? '#C9A84C' : '#888',
                background: isActive ? 'rgba(201,168,76,0.07)' : 'transparent',
                borderRight: isActive ? '2px solid #C9A84C' : '2px solid transparent',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: '12px', opacity: 0.7 }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '20px 24px', borderTop: '1px solid #1e1e1e' }}>
        <a
          href="/api/admin/logout"
          style={{
            display: 'block',
            padding: '10px 16px',
            background: 'transparent',
            border: '1px solid #2a2a2a',
            borderRadius: '4px',
            color: '#666',
            fontSize: '13px',
            textAlign: 'center',
            textDecoration: 'none',
            transition: 'all 0.15s',
          }}
        >
          خروج
        </a>
      </div>
    </aside>
  )
}

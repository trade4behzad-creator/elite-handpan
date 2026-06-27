import { Vazirmatn } from 'next/font/google'
import '../globals.css'

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  variable: '--font-vazirmatn',
})

export const metadata = {
  title: 'پنل مدیریت | Elite Handpan',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body
        style={{
          fontFamily: 'var(--font-vazirmatn), Arial, sans-serif',
          background: '#0a0a0a',
          color: '#f5f5f5',
          margin: 0,
          minHeight: '100vh',
        }}
      >
        {children}
      </body>
    </html>
  )
}

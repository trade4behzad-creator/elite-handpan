import AdminSidebar from './AdminSidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'row-reverse' }}>
      <AdminSidebar />
      <main
        style={{
          flex: 1,
          padding: '40px 48px',
          background: '#0a0a0a',
          overflowY: 'auto',
        }}
      >
        {children}
      </main>
    </div>
  )
}

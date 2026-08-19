'use client'

export default function StopPropagation({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{ display: 'flex', gap: '4px', flexShrink: 0 }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </span>
  )
}

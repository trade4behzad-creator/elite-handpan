import { supabaseAdmin } from '../../../../lib/supabase'
import { revalidatePath } from 'next/cache'

type Message = {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  read: boolean
  created_at: string
}

async function markRead(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  await supabaseAdmin.from('messages').update({ read: true }).eq('id', id)
  revalidatePath('/admin/dashboard/messages')
}

async function deleteMessage(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  await supabaseAdmin.from('messages').delete().eq('id', id)
  revalidatePath('/admin/dashboard/messages')
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const GOLD = '#C9A84C'

export default async function MessagesPage() {
  const { data: messages } = await supabaseAdmin
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <p style={{ color: GOLD, fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '8px' }}>
          مدیریت
        </p>
        <h1 style={{ fontSize: '28px', fontWeight: '300', color: '#f5f5f5', margin: 0 }}>پیام‌ها</h1>
        <div style={{ width: '40px', height: '1px', background: GOLD, marginTop: '16px', opacity: 0.5 }} />
      </div>

      {(!messages || messages.length === 0) ? (
        <div
          style={{
            background: '#111',
            border: '1px solid #1e1e1e',
            borderRadius: '8px',
            padding: '48px',
            textAlign: 'center',
            color: '#555',
          }}
        >
          <p style={{ fontSize: '16px', marginBottom: '8px' }}>هیچ پیامی وجود ندارد</p>
          <p style={{ fontSize: '13px' }}>پیام‌های فرم تماس اینجا نمایش داده می‌شوند</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {(messages as Message[]).map((msg) => (
            <div
              key={msg.id}
              style={{
                background: '#111',
                border: `1px solid ${msg.read ? '#1e1e1e' : '#C9A84C30'}`,
                borderRadius: '8px',
                padding: '24px',
                position: 'relative',
              }}
            >
              {/* Unread indicator */}
              {!msg.read && (
                <span
                  style={{
                    position: 'absolute',
                    top: '24px',
                    left: '24px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: GOLD,
                  }}
                />
              )}

              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <p style={{ color: '#f5f5f5', fontSize: '15px', fontWeight: '500', margin: '0 0 4px' }}>{msg.name}</p>
                  <p style={{ color: '#555', fontSize: '12px', margin: 0, direction: 'ltr' }}>{msg.email}</p>
                  {msg.phone && (
                    <p style={{ color: '#555', fontSize: '12px', margin: '2px 0 0', direction: 'ltr' }}>{msg.phone}</p>
                  )}
                </div>
                <p style={{ color: '#444', fontSize: '12px', margin: 0 }}>{formatDate(msg.created_at)}</p>
              </div>

              {/* Subject */}
              <p style={{ color: GOLD, fontSize: '13px', margin: '0 0 10px' }}>{msg.subject}</p>

              {/* Message body */}
              <p
                style={{
                  color: '#888',
                  fontSize: '14px',
                  lineHeight: '1.7',
                  margin: '0 0 20px',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {msg.message}
              </p>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {!msg.read && (
                  <form action={markRead}>
                    <input type="hidden" name="id" value={msg.id} />
                    <button
                      type="submit"
                      style={{
                        padding: '7px 16px',
                        background: 'transparent',
                        border: `1px solid ${GOLD}40`,
                        borderRadius: '4px',
                        color: GOLD,
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-vazirmatn), Arial, sans-serif',
                      }}
                    >
                      علامت‌گذاری به عنوان خوانده‌شده
                    </button>
                  </form>
                )}
                <a
                  href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                  style={{
                    padding: '7px 16px',
                    background: 'transparent',
                    border: '1px solid #2a2a2a',
                    borderRadius: '4px',
                    color: '#888',
                    fontSize: '12px',
                    textDecoration: 'none',
                  }}
                >
                  پاسخ
                </a>
                <form action={deleteMessage}>
                  <input type="hidden" name="id" value={msg.id} />
                  <button
                    type="submit"
                    style={{
                      padding: '7px 16px',
                      background: 'transparent',
                      border: '1px solid rgba(239,68,68,0.3)',
                      borderRadius: '4px',
                      color: '#f87171',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-vazirmatn), Arial, sans-serif',
                    }}
                  >
                    حذف
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

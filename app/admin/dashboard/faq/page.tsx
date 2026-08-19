import { supabaseAdmin } from '../../../../lib/supabase-admin'
import { createFaq, updateFaq, deleteFaq, reorderFaq } from './actions'
import FaqFormFields from './FaqFormFields'

const GOLD = '#3F3E7A'

type Faq = {
  id: string
  question_en: string
  question_fa: string | null
  answer_en: string
  answer_fa: string | null
  sort_order: number
}

export default async function FaqAdminPage() {
  const { data: faqs, error } = await supabaseAdmin
    .from('faqs')
    .select('id, question_en, question_fa, answer_en, answer_fa, sort_order')
    .order('sort_order', { ascending: true })

  async function handleReorder(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    const direction = formData.get('direction') as string
    await reorderFaq(id, direction === 'up' ? -1 : 1)
  }

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <p style={{ color: GOLD, fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '8px' }}>
          پشتیبانی
        </p>
        <h1 style={{ fontSize: '28px', fontWeight: '300', color: '#f5f5f5', margin: 0 }}>سوالات متداول</h1>
        <div style={{ width: '40px', height: '1px', background: GOLD, marginTop: '16px', opacity: 0.5 }} />
      </div>

      {/* Add new FAQ */}
      <details style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', marginBottom: '24px' }}>
        <summary style={{ padding: '18px 24px', cursor: 'pointer', color: GOLD, fontSize: '14px', fontWeight: 600, listStyle: 'none' }}>
          + افزودن سوال جدید
        </summary>
        <form action={createFaq} style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FaqFormFields />
          <button
            type="submit"
            style={{ alignSelf: 'flex-start', padding: '10px 24px', background: GOLD, border: 'none', borderRadius: '4px', color: '#0a0a0a', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
          >
            افزودن
          </button>
        </form>
      </details>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '6px', padding: '14px 20px', color: '#f87171', fontSize: '14px' }}>
          خطا در دریافت اطلاعات
        </div>
      )}

      {/* Existing FAQs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {(faqs as Faq[] | null)?.map((faq, i) => (
          <details key={faq.id} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px' }}>
            <summary style={{ padding: '16px 24px', cursor: 'pointer', color: '#f5f5f5', fontSize: '13px', listStyle: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <span style={{ direction: 'ltr', textAlign: 'left', flex: 1 }}>{faq.question_en}</span>
              <span style={{ display: 'flex', gap: '4px', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                <form action={handleReorder}>
                  <input type="hidden" name="id" value={faq.id} />
                  <input type="hidden" name="direction" value="up" />
                  <button type="submit" disabled={i === 0} style={{ width: '24px', height: '22px', background: 'transparent', border: '1px solid #2a2a2a', borderRadius: '4px', color: i === 0 ? '#333' : '#888', cursor: i === 0 ? 'not-allowed' : 'pointer', fontSize: '11px' }}>▲</button>
                </form>
                <form action={handleReorder}>
                  <input type="hidden" name="id" value={faq.id} />
                  <input type="hidden" name="direction" value="down" />
                  <button type="submit" disabled={i === (faqs?.length ?? 0) - 1} style={{ width: '24px', height: '22px', background: 'transparent', border: '1px solid #2a2a2a', borderRadius: '4px', color: i === (faqs?.length ?? 0) - 1 ? '#333' : '#888', cursor: i === (faqs?.length ?? 0) - 1 ? 'not-allowed' : 'pointer', fontSize: '11px' }}>▼</button>
                </form>
              </span>
            </summary>
            <form action={updateFaq} style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input type="hidden" name="id" value={faq.id} />
              <FaqFormFields
                defaults={{
                  question_en: faq.question_en,
                  question_fa: faq.question_fa ?? '',
                  answer_en: faq.answer_en,
                  answer_fa: faq.answer_fa ?? '',
                }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ padding: '9px 22px', background: GOLD, border: 'none', borderRadius: '4px', color: '#0a0a0a', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                  ذخیره
                </button>
              </div>
            </form>
            <form action={deleteFaq} style={{ padding: '0 24px 20px' }}>
              <input type="hidden" name="id" value={faq.id} />
              <button type="submit" style={{ padding: '9px 22px', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '4px', color: '#f87171', fontSize: '13px', cursor: 'pointer' }}>
                حذف این سوال
              </button>
            </form>
          </details>
        ))}
      </div>
    </div>
  )
}

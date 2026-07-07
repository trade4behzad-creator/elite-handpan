import Link from 'next/link'
import { supabaseAdmin } from '../../../../lib/supabase-admin'
import { deleteInstagramPost } from './actions'

const GOLD = '#3F3E7A'

export default async function InstagramListPage() {
  const { data: posts } = await supabaseAdmin
    .from('instagram_posts')
    .select('*')
    .order('order', { ascending: true })

  return (
    <div>
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: GOLD, fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '8px' }}>
            اینستاگرام
          </p>
          <h1 style={{ fontSize: '28px', fontWeight: '300', color: '#f5f5f5', margin: 0 }}>پست‌های اینستاگرام</h1>
          <div style={{ width: '40px', height: '1px', background: GOLD, marginTop: '16px', opacity: 0.5 }} />
        </div>
        <Link
          href="/admin/dashboard/instagram/new"
          style={{
            padding: '12px 24px',
            background: GOLD,
            borderRadius: '4px',
            color: '#0a0a0a',
            fontSize: '14px',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          + افزودن پست
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
        {(posts ?? []).map((post) => (
          <div
            key={post.id}
            style={{
              background: '#111',
              border: '1px solid #1e1e1e',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <img
              src={post.image_url}
              alt=""
              style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }}
            />
            <div style={{ padding: '10px' }}>
              <p style={{ fontSize: '11px', color: '#666', marginBottom: '8px', wordBreak: 'break-all' }}>
                {post.post_url}
              </p>
              <a href={`/admin/dashboard/instagram/edit/${post.id}`}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '8px',
                  background: 'transparent',
                  border: `1px solid ${GOLD}40`,
                  borderRadius: '4px',
                  color: GOLD,
                  fontSize: '12px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  marginBottom: '6px',
                }}
              >
                ویرایش
              </a>
              <form
                action={async () => {
                  'use server'
                  await deleteInstagramPost(post.id, post.image_url)
                }}
              >
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: 'transparent',
                    border: '1px solid #f8717140',
                    borderRadius: '4px',
                    color: '#f87171',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  حذف
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
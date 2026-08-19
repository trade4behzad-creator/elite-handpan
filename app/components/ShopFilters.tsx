'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

type FilterLabels = {
  scaleLabel: string
  notesLabel: string
  featuredLabel: string
  sortLabel: string
  allOption: string
  sortPriceAsc: string
  sortPriceDesc: string
  clearLabel: string
  filtersTitle: string
  sortRecommendedOption?: string
}

export default function ShopFilters({
  scales,
  noteCounts,
  categories = [],
  labels,
  hasFeaturedFilter = true,
}: {
  scales: string[]
  noteCounts: number[]
  categories?: string[]
  labels: FilterLabels
  hasFeaturedFilter?: boolean
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === null || value === '') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    background: '#fff',
    border: '1px solid #e5e5e5',
    borderRadius: '4px',
    color: '#333',
    fontSize: '13px',
    outline: 'none',
    cursor: 'pointer',
  }

  const groupStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '8px' }
  const groupLabelStyle: React.CSSProperties = { fontSize: '11px', color: '#999', letterSpacing: '0.05em' }

  const currentScale = searchParams.get('scale') ?? ''
  const currentNotes = searchParams.get('notes') ?? ''
  const currentCategory = searchParams.get('category') ?? ''
  const currentFeatured = searchParams.get('featured') ?? ''
  const currentSort = searchParams.get('sort') ?? ''

  const hasActiveFilters = currentScale || currentNotes || currentCategory || currentFeatured || currentSort

  return (
    <aside
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '24px',
        background: '#fafafa',
        border: '1px solid #eee',
        borderRadius: '6px',
        height: 'fit-content',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#111', margin: 0 }}>
          {labels.filtersTitle}
        </h2>
        {hasActiveFilters && (
          <button
            onClick={() => router.push(pathname, { scroll: false })}
            style={{ background: 'none', border: 'none', color: '#3F3E7A', fontSize: '12px', cursor: 'pointer', padding: 0 }}
          >
            {labels.clearLabel}
          </button>
        )}
      </div>

      {scales.length > 0 && (
        <div style={groupStyle}>
          <label style={groupLabelStyle}>{labels.scaleLabel}</label>
          <select value={currentScale} onChange={(e) => updateParam('scale', e.target.value || null)} style={selectStyle}>
            <option value="">{labels.allOption}</option>
            {scales.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}

      {noteCounts.length > 0 && (
        <div style={groupStyle}>
          <label style={groupLabelStyle}>{labels.notesLabel}</label>
          <select value={currentNotes} onChange={(e) => updateParam('notes', e.target.value || null)} style={selectStyle}>
            <option value="">{labels.allOption}</option>
            {noteCounts.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      )}

      {categories.length > 0 && (
        <div style={groupStyle}>
          <label style={groupLabelStyle}>{labels.scaleLabel}</label>
          <select value={currentCategory} onChange={(e) => updateParam('category', e.target.value || null)} style={selectStyle}>
            <option value="">{labels.allOption}</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}

      {hasFeaturedFilter && (
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#333', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={currentFeatured === '1'}
            onChange={(e) => updateParam('featured', e.target.checked ? '1' : null)}
          />
          {labels.featuredLabel}
        </label>
      )}

      <div style={{ height: '1px', background: '#eee' }} />

      <div style={groupStyle}>
        <label style={groupLabelStyle}>{labels.sortLabel}</label>
        <select value={currentSort} onChange={(e) => updateParam('sort', e.target.value || null)} style={selectStyle}>
          <option value="">{labels.sortRecommendedOption ?? labels.allOption}</option>
          <option value="price_asc">{labels.sortPriceAsc}</option>
          <option value="price_desc">{labels.sortPriceDesc}</option>
        </select>
      </div>
    </aside>
  )
}

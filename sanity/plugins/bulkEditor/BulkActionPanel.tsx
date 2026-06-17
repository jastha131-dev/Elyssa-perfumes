// sanity/plugins/bulkEditor/BulkActionPanel.tsx
import React, { useState } from 'react'
import type { BulkOps } from './types'

type TriState = true | false | null

interface TriStateToggleProps {
  value: TriState
  onChange: (v: TriState) => void
  label: string
}

function TriStateToggle({ value, onChange, label }: TriStateToggleProps) {
  const opts: { label: string; val: TriState }[] = [
    { label: 'ON', val: true },
    { label: 'OFF', val: false },
    { label: '—', val: null },
  ]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{ fontSize: 12, color: 'var(--muted-fg)', minWidth: 70 }}>{label}</span>
      {opts.map(opt => (
        <button
          key={String(opt.val)}
          type="button"
          onClick={() => onChange(opt.val)}
          style={{
            padding: '3px 9px',
            fontSize: 11,
            fontWeight: 600,
            border: '1px solid var(--card-border-color)',
            borderRadius: 3,
            cursor: 'pointer',
            background: value === opt.val ? '#4a7cf7' : 'transparent',
            color: value === opt.val ? '#fff' : 'var(--card-fg)',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '4px 8px',
  fontSize: 12,
  border: '1px solid var(--card-border-color)',
  borderRadius: 3,
  background: 'var(--card-bg)',
  color: 'var(--card-fg)',
}

const sectionStyle: React.CSSProperties = {
  border: '1px solid var(--card-border-color)',
  borderRadius: 5,
  padding: '10px 12px',
  marginBottom: 8,
}

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--muted-fg)',
  marginBottom: 8,
  display: 'block',
}

interface BulkActionPanelProps {
  selectedCount: number
  loading: boolean
  onApply: (ops: BulkOps) => void
}

export function BulkActionPanel({ selectedCount, loading, onApply }: BulkActionPanelProps) {
  const [priceMode, setPriceMode] = useState<'pct' | 'flat'>('pct')
  const [priceValue, setPriceValue] = useState('')
  const [compareAtMarkup, setCompareAtMarkup] = useState('')
  const [clearSale, setClearSale] = useState(false)

  const [flagNew, setFlagNew] = useState<TriState>(null)
  const [flagBS, setFlagBS] = useState<TriState>(null)
  const [flagInStock, setFlagInStock] = useState<TriState>(null)
  const [status, setStatus] = useState('')

  const [addTagsInput, setAddTagsInput] = useState('')
  const [removeTagsInput, setRemoveTagsInput] = useState('')

  const [badgeTextEn, setBadgeTextEn] = useState('')
  const [badgeTextAr, setBadgeTextAr] = useState('')
  const [badgeColor, setBadgeColor] = useState('')

  const hasOps =
    priceValue !== '' ||
    compareAtMarkup !== '' ||
    clearSale ||
    flagNew !== null ||
    flagBS !== null ||
    flagInStock !== null ||
    status !== '' ||
    addTagsInput.trim() !== '' ||
    removeTagsInput.trim() !== '' ||
    badgeTextEn !== '' ||
    badgeTextAr !== '' ||
    badgeColor !== ''

  function handleApply() {
    const ops: BulkOps = {}

    if (priceValue !== '') {
      ops.priceMode = priceMode
      ops.priceValue = parseFloat(priceValue)
    }
    if (compareAtMarkup !== '') ops.compareAtMarkupPct = parseFloat(compareAtMarkup)
    if (clearSale) ops.clearSale = true

    if (flagNew !== null) ops.new = flagNew
    if (flagBS !== null) ops.bestSeller = flagBS
    if (flagInStock !== null) ops.inStock = flagInStock
    if (status) ops.status = status as 'active' | 'draft' | 'archived'

    const addTags = addTagsInput.split(',').map(t => t.trim()).filter(Boolean)
    const removeTags = removeTagsInput.split(',').map(t => t.trim()).filter(Boolean)
    if (addTags.length > 0) ops.addTags = addTags
    if (removeTags.length > 0) ops.removeTags = removeTags

    if (badgeTextEn) ops.badgeText_en = badgeTextEn
    if (badgeTextAr) ops.badgeText_ar = badgeTextAr
    if (badgeColor) ops.badgeColor = badgeColor

    onApply(ops)
  }

  return (
    <div style={{ borderTop: '2px solid var(--card-border-color)', background: 'var(--card-bg)', padding: 16, maxHeight: 380, overflowY: 'auto' }}>
      <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 600 }}>
        Bulk Actions — {selectedCount} product{selectedCount !== 1 ? 's' : ''} selected
      </p>

      {/* ── Price ── */}
      <div style={sectionStyle}>
        <span style={sectionLabelStyle}>Price</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
          <select
            value={priceMode}
            onChange={e => setPriceMode(e.target.value as 'pct' | 'flat')}
            style={inputStyle}
          >
            <option value="pct">%</option>
            <option value="flat">Flat $</option>
          </select>
          <input
            type="number"
            placeholder={priceMode === 'pct' ? '+10 or -10' : '+5.00 or -5.00'}
            value={priceValue}
            onChange={e => setPriceValue(e.target.value)}
            style={{ ...inputStyle, width: 130 }}
          />
          <span style={{ fontSize: 11, color: 'var(--muted-fg)' }}>
            Applies to base price + all volume prices
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--muted-fg)' }}>compareAt markup %:</span>
            <input
              type="number"
              placeholder="e.g. 20"
              value={compareAtMarkup}
              onChange={e => setCompareAtMarkup(e.target.value)}
              style={{ ...inputStyle, width: 80 }}
            />
          </div>
          <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={clearSale}
              onChange={e => setClearSale(e.target.checked)}
            />
            Clear sale (remove compareAtPrice)
          </label>
        </div>
      </div>

      {/* ── Flags ── */}
      <div style={sectionStyle}>
        <span style={sectionLabelStyle}>Flags</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <TriStateToggle value={flagNew} onChange={setFlagNew} label="New" />
          <TriStateToggle value={flagBS} onChange={setFlagBS} label="Best Seller" />
          <TriStateToggle value={flagInStock} onChange={setFlagInStock} label="In Stock" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--muted-fg)', minWidth: 70 }}>Status</span>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              style={inputStyle}
            >
              <option value="">— skip —</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Tags ── */}
      <div style={sectionStyle}>
        <span style={sectionLabelStyle}>Tags</span>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 160 }}>
            <span style={{ fontSize: 11, color: 'var(--muted-fg)', display: 'block', marginBottom: 4 }}>
              Add (comma-separated)
            </span>
            <input
              type="text"
              placeholder="oud, floral, unisex"
              value={addTagsInput}
              onChange={e => setAddTagsInput(e.target.value)}
              style={{ ...inputStyle, width: '100%' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <span style={{ fontSize: 11, color: 'var(--muted-fg)', display: 'block', marginBottom: 4 }}>
              Remove (comma-separated)
            </span>
            <input
              type="text"
              placeholder="sale, limited"
              value={removeTagsInput}
              onChange={e => setRemoveTagsInput(e.target.value)}
              style={{ ...inputStyle, width: '100%' }}
            />
          </div>
        </div>
      </div>

      {/* ── Badge ── */}
      <div style={sectionStyle}>
        <span style={sectionLabelStyle}>Badge</span>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Badge text EN"
            value={badgeTextEn}
            onChange={e => setBadgeTextEn(e.target.value)}
            style={{ ...inputStyle, flex: 1, minWidth: 140 }}
          />
          <input
            type="text"
            placeholder="Badge text AR"
            value={badgeTextAr}
            onChange={e => setBadgeTextAr(e.target.value)}
            style={{ ...inputStyle, flex: 1, minWidth: 140 }}
          />
          <select
            value={badgeColor}
            onChange={e => setBadgeColor(e.target.value)}
            style={inputStyle}
          >
            <option value="">— color skip —</option>
            <option value="gold">Gold</option>
            <option value="black">Black</option>
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
            <option value="pink">Pink</option>
          </select>
        </div>
      </div>

      {/* ── Apply ── */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
        <button
          type="button"
          onClick={handleApply}
          disabled={!hasOps || selectedCount === 0 || loading}
          style={{
            padding: '10px 28px',
            fontSize: 13,
            fontWeight: 600,
            background: hasOps && selectedCount > 0 && !loading ? '#c8a96e' : '#888',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: hasOps && selectedCount > 0 && !loading ? 'pointer' : 'not-allowed',
            transition: 'background 0.15s',
          }}
        >
          {loading ? 'Applying…' : `Apply to ${selectedCount} product${selectedCount !== 1 ? 's' : ''} →`}
        </button>
      </div>
    </div>
  )
}

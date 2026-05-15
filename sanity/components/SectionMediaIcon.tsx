import React from 'react'

const SECTION_CONFIG: Record<string, { emoji: string; bg: string; fg: string; shortLabel: string; label: string }> = {
  heroSection:             { emoji: '◉', bg: '#78350F', fg: '#FCD34D', shortLabel: 'HERO',       label: 'Hero Banner'         },
  customBannerSection:     { emoji: '◈', bg: '#4C1D95', fg: '#C4B5FD', shortLabel: 'BANNER',     label: 'Custom Banner'       },
  featuredProductsSection: { emoji: '✦', bg: '#92400E', fg: '#FDE68A', shortLabel: 'PRODUCTS',   label: 'Featured Products'   },
  bestSellersSection:      { emoji: '★', bg: '#7C2D12', fg: '#FCA5A5', shortLabel: 'SELLERS',    label: 'Best Sellers'        },
  categoriesSection:       { emoji: '⊞', bg: '#064E3B', fg: '#6EE7B7', shortLabel: 'CATEG',      label: 'Categories'          },
  marqueeSection:          { emoji: '↔', bg: '#1E3A5F', fg: '#93C5FD', shortLabel: 'MARQUEE',    label: 'Marquee Strip'       },
  scentBannerSection:      { emoji: '✿', bg: '#831843', fg: '#FBCFE8', shortLabel: 'SCENT',      label: 'Scent Banner'        },
  brandStorySection:       { emoji: '◎', bg: '#1F2937', fg: '#D1D5DB', shortLabel: 'STORY',      label: 'Brand Story'         },
  testimonialsSection:     { emoji: '❝', bg: '#14532D', fg: '#86EFAC', shortLabel: 'REVIEWS',    label: 'Testimonials'        },
  newsletterSection:       { emoji: '✉', bg: '#1E3A8A', fg: '#BFDBFE', shortLabel: 'EMAIL',      label: 'Newsletter'          },
  trustBarSection:         { emoji: '✓', bg: '#44403C', fg: '#D6D3D1', shortLabel: 'TRUST',      label: 'Trust Bar'           },
}

export function createSectionIcon(type: string) {
  const c = SECTION_CONFIG[type] || { emoji: '◻', bg: '#374151', fg: '#E5E7EB', shortLabel: 'BLOCK', label: 'Section' }
  return function SectionIcon() {
    return (
      <div style={{
        width: 46,
        height: 46,
        background: c.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        gap: 2,
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 17, lineHeight: 1, color: c.fg }}>{c.emoji}</span>
        <span style={{
          fontSize: 7,
          fontWeight: 700,
          letterSpacing: '0.06em',
          color: c.fg,
          opacity: 0.85,
          lineHeight: 1,
        }}>{c.shortLabel}</span>
      </div>
    )
  }
}

export function getSectionLabel(type: string): string {
  return SECTION_CONFIG[type]?.label ?? type
}

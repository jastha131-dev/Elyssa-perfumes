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
  videoBannerSection:      { emoji: '▶', bg: '#1C1917', fg: '#FCA5A5', shortLabel: 'VIDEO',      label: 'Video Banner'        },
  newArrivalsSection:      { emoji: '✦', bg: '#065F46', fg: '#6EE7B7', shortLabel: 'NEW',        label: 'New Arrivals'        },
  collectionsGridSection:  { emoji: '⊟', bg: '#1E3A5F', fg: '#BFDBFE', shortLabel: 'COLLS',     label: 'Collections Grid'   },
  faqSection:              { emoji: '?', bg: '#312E81', fg: '#C4B5FD', shortLabel: 'FAQ',        label: 'FAQ Accordion'       },
  imageWithTextSection:    { emoji: '◧', bg: '#78350F', fg: '#FDE68A', shortLabel: 'IMG+TXT',   label: 'Image with Text'    },
  videoWithTextSection:    { emoji: '◧', bg: '#1C1917', fg: '#D6D3D1', shortLabel: 'VID+TXT',   label: 'Video with Text'    },
  instagramFeedSection:    { emoji: '◈', bg: '#831843', fg: '#FBCFE8', shortLabel: 'INSTA',      label: 'Instagram Feed'      },
  countdownTimerSection:   { emoji: '⏱', bg: '#7C2D12', fg: '#FED7AA', shortLabel: 'TIMER',      label: 'Countdown Timer'     },
  richTextSection:         { emoji: '¶', bg: '#374151', fg: '#E5E7EB', shortLabel: 'TEXT',       label: 'Rich Text'           },
  multiColumnSection:      { emoji: '⊞', bg: '#14532D', fg: '#86EFAC', shortLabel: 'COLS',       label: 'Multi-Column'        },
  beforeAfterSection:      { emoji: '⇔', bg: '#4C1D95', fg: '#C4B5FD', shortLabel: 'B/AFT',      label: 'Before / After'      },
  comparisonTableSection:  { emoji: '≡', bg: '#1F2937', fg: '#D1D5DB', shortLabel: 'COMPARE',   label: 'Comparison Table'   },
  tabsSection:             { emoji: '⊡', bg: '#064E3B', fg: '#A7F3D0', shortLabel: 'TABS',       label: 'Tabs Section'        },
  upsellSection:           { emoji: '↑', bg: '#92400E', fg: '#FDE68A', shortLabel: 'UPSELL',     label: 'Upsell Products'     },
  announcementBar:         { emoji: '!', bg: '#B45309', fg: '#FEF3C7', shortLabel: 'ANNC',       label: 'Announcement Bar'    },
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

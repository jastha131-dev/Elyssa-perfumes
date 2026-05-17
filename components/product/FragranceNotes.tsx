'use client'

import { motion } from 'framer-motion'
import { Wind, Leaf, Layers } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

interface FragranceNotesProps {
  topNotes: string[]
  middleNotes: string[]
  baseNotes: string[]
  intensity?: string
  sillage?: string
  longevity?: string
}

// ─── Note pill ─────────────────────────────────────────────────────────────────

interface NotePillProps {
  note: string
  delay: number
}

function NotePill({ note, delay }: NotePillProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{
        duration: 0.35,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={cn(
        'inline-flex items-center px-3 py-1',
        'text-[11px] font-medium tracking-[0.1em] uppercase',
        'border border-gold-500/60 text-charcoal-700',
        'bg-gold-50 hover:bg-gold-100 hover:border-gold-500',
        'transition-colors duration-150',
        'select-none'
      )}
    >
      {note}
    </motion.span>
  )
}

// ─── Performance bar ───────────────────────────────────────────────────────────

type Level = 'low' | 'medium' | 'high' | 'very high' | 'intense' | string

function levelToPercent(level: Level | undefined): number {
  if (!level) return 0
  const map: Record<string, number> = {
    low: 25,
    light: 25,
    moderate: 50,
    medium: 50,
    strong: 75,
    high: 75,
    'very high': 90,
    intense: 100,
    exceptional: 100,
  }
  return map[level.toLowerCase()] ?? 50
}

interface PerformanceBarProps {
  label: string
  value: string | undefined
  icon: React.ReactNode
  delay: number
}

function PerformanceBar({ label, value, icon, delay }: PerformanceBarProps) {
  const pct = levelToPercent(value)

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.45, delay }}
      className="flex flex-col gap-1.5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-gold-500" aria-hidden="true">
            {icon}
          </span>
          <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-charcoal-600">
            {label}
          </span>
        </div>
        <span className="text-[11px] text-charcoal-500 capitalize font-medium">
          {value ?? '—'}
        </span>
      </div>

      {/* Track */}
      <div
        className="relative h-0.5 w-full bg-charcoal-100 overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${value}`}
      >
        <motion.div
          className="absolute inset-y-0 left-0 bg-gold-500"
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: delay + 0.2, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  )
}

// ─── Notes row ─────────────────────────────────────────────────────────────────

interface NotesRowProps {
  title: string
  subtitle: string
  notes: string[]
  icon: React.ReactNode
  baseDelay: number
  accentClass: string
}

function NotesRow({
  title,
  subtitle,
  notes,
  icon,
  baseDelay,
  accentClass,
}: NotesRowProps) {
  if (notes.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, delay: baseDelay }}
      className="flex flex-col gap-2.5"
    >
      {/* Row header */}
      <div className="flex items-center gap-2">
        <span className={cn('shrink-0', accentClass)} aria-hidden="true">
          {icon}
        </span>
        <div>
          <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-charcoal-800">
            {title}
          </span>
          <span className="ml-2 text-[10px] text-charcoal-400 tracking-wider">
            {subtitle}
          </span>
        </div>
      </div>

      {/* Pills */}
      <div className="flex flex-wrap gap-2 pl-6">
        {notes.map((note, i) => (
          <NotePill key={note} note={note} delay={baseDelay + 0.05 * i} />
        ))}
      </div>
    </motion.div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export function FragranceNotes({
  topNotes,
  middleNotes,
  baseNotes,
  intensity,
  sillage,
  longevity,
}: FragranceNotesProps) {
  const t = useTranslations('product')
  const hasPerformance = intensity || sillage || longevity

  return (
    <section aria-label="Fragrance notes and performance" className="flex flex-col gap-8">
      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <h3 className="font-display text-lg text-charcoal-900 leading-tight">
          {t('fragranceProfile')}
        </h3>
        <p className="text-xs text-charcoal-400 mt-1 tracking-wide">
          {t('fragranceProfileDesc')}
        </p>
      </motion.div>

      {/* ── Notes pyramid ─────────────────────────────────────────────────── */}
      <div className="relative flex flex-col gap-6 pl-4 border-l-2 border-gold-200">
        {/* Pyramid connector dots */}
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute left-[-5px] w-2 h-2 rounded-full bg-gold-500 border-2 border-white shadow-sm"
            style={{ top: `${i === 0 ? 2 : i === 1 ? 50 : 98}%` }}
            aria-hidden="true"
          />
        ))}

        <NotesRow
          title={t('topNotes')}
          subtitle={t('topNotesSubtitle')}
          notes={topNotes}
          icon={<Wind size={13} strokeWidth={1.75} />}
          baseDelay={0}
          accentClass="text-gold-400"
        />

        <NotesRow
          title={t('heartNotes')}
          subtitle={t('heartNotesSubtitle')}
          notes={middleNotes}
          icon={<Leaf size={13} strokeWidth={1.75} />}
          baseDelay={0.1}
          accentClass="text-gold-500"
        />

        <NotesRow
          title={t('baseNotes')}
          subtitle={t('baseNotesSubtitle')}
          notes={baseNotes}
          icon={<Layers size={13} strokeWidth={1.75} />}
          baseDelay={0.2}
          accentClass="text-gold-600"
        />
      </div>

      {/* ── Performance indicators ─────────────────────────────────────── */}
      {hasPerformance && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-col gap-4 pt-2 border-t border-charcoal-100"
        >
          <h4 className="text-[11px] font-bold tracking-[0.15em] uppercase text-charcoal-700">
            {t('performance')}
          </h4>

          <div className="flex flex-col gap-4">
            {intensity && (
              <PerformanceBar
                label={t('intensity')}
                value={intensity}
                icon={
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 2v20M2 12h20" />
                  </svg>
                }
                delay={0.35}
              />
            )}

            {sillage && (
              <PerformanceBar
                label={t('sillage')}
                value={sillage}
                icon={
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 12s1-5 8-5 8 5 8 5-1 5-8 5-8-5-8-5z" />
                    <circle cx="12" cy="12" r="1.5" />
                  </svg>
                }
                delay={0.45}
              />
            )}

            {longevity && (
              <PerformanceBar
                label={t('longevity')}
                value={longevity}
                icon={
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                }
                delay={0.55}
              />
            )}
          </div>
        </motion.div>
      )}
    </section>
  )
}

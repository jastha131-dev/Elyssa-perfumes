import { cn } from '@/lib/utils'

// ─── Base shimmer block ────────────────────────────────────────────────────────

interface SkeletonBlockProps {
  className?: string
}

function SkeletonBlock({ className }: SkeletonBlockProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative overflow-hidden rounded-none bg-charcoal-100',
        'before:absolute before:inset-0',
        'before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent',
        'before:animate-shimmer before:bg-[length:200%_100%]',
        className
      )}
    />
  )
}

// ─── TextSkeleton ──────────────────────────────────────────────────────────────

interface TextSkeletonProps {
  width?: string
  height?: string
  className?: string
}

export function TextSkeleton({
  width = 'w-full',
  height = 'h-4',
  className,
}: TextSkeletonProps) {
  return <SkeletonBlock className={cn(width, height, 'rounded-sm', className)} />
}

// ─── ProductCardSkeleton ───────────────────────────────────────────────────────

export function ProductCardSkeleton() {
  return (
    <div aria-label="Loading product" className="flex flex-col gap-3 w-full">
      {/* Image — matches [3/4] aspect ratio */}
      <SkeletonBlock className="w-full aspect-[3/4] bg-charcoal-100" />

      {/* Category label */}
      <SkeletonBlock className="h-3 w-1/3 rounded-sm" />

      {/* Product name */}
      <SkeletonBlock className="h-5 w-3/4 rounded-sm" />

      {/* Price row */}
      <div className="flex items-center gap-3">
        <SkeletonBlock className="h-4 w-1/4 rounded-sm" />
        <SkeletonBlock className="h-4 w-1/5 rounded-sm opacity-60" />
      </div>
    </div>
  )
}

// ─── ProductDetailSkeleton ─────────────────────────────────────────────────────

export function ProductDetailSkeleton() {
  return (
    <div
      aria-label="Loading product details"
      className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 w-full"
    >
      {/* Left — image gallery */}
      <div className="flex flex-col gap-3">
        <SkeletonBlock className="w-full aspect-[3/4]" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBlock key={i} className="w-16 h-16 shrink-0" />
          ))}
        </div>
      </div>

      {/* Right — product info */}
      <div className="flex flex-col gap-5 pt-2">
        <SkeletonBlock className="h-3 w-1/4 rounded-sm" />
        <SkeletonBlock className="h-9 w-2/3 rounded-sm" />
        <div className="flex items-center gap-4">
          <SkeletonBlock className="h-6 w-1/5 rounded-sm" />
          <SkeletonBlock className="h-5 w-1/6 rounded-sm opacity-60" />
        </div>

        {/* Divider */}
        <SkeletonBlock className="h-px w-full opacity-30" />

        {/* Description lines */}
        <div className="flex flex-col gap-2">
          <SkeletonBlock className="h-4 w-full rounded-sm" />
          <SkeletonBlock className="h-4 w-5/6 rounded-sm" />
          <SkeletonBlock className="h-4 w-4/6 rounded-sm" />
        </div>

        {/* Volume selector */}
        <div className="flex gap-2 mt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-10 w-20 rounded-sm" />
          ))}
        </div>

        {/* CTA button */}
        <SkeletonBlock className="h-12 w-full rounded-sm mt-2" />

        {/* Notes section */}
        <div className="flex flex-col gap-3 mt-4">
          <SkeletonBlock className="h-5 w-1/3 rounded-sm" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-7 w-20 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

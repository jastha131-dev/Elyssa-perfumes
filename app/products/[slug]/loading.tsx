export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb skeleton */}
        <div className="py-5 border-b border-charcoal-100 flex items-center gap-2">
          <div className="h-3 w-10 rounded bg-charcoal-100 animate-pulse" />
          <div className="h-3 w-3 rounded bg-charcoal-100 animate-pulse" />
          <div className="h-3 w-20 rounded bg-charcoal-100 animate-pulse" />
          <div className="h-3 w-3 rounded bg-charcoal-100 animate-pulse" />
          <div className="h-3 w-28 rounded bg-charcoal-100 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 xl:gap-24 py-10">

          {/* Image skeleton */}
          <div className="flex flex-col gap-3">
            <div className="aspect-[3/4] w-full bg-charcoal-100 animate-pulse" />
            <div className="flex gap-2">
              {[0, 1].map((i) => (
                <div key={i} className="h-16 w-16 bg-charcoal-100 animate-pulse" />
              ))}
            </div>
          </div>

          {/* Info skeleton */}
          <div className="mt-10 lg:mt-0 flex flex-col gap-5">
            {/* Category line */}
            <div className="flex items-center gap-3">
              <div className="h-3 w-16 rounded bg-gold-100 animate-pulse" />
              <div className="h-3 w-1 rounded bg-charcoal-100 animate-pulse" />
              <div className="h-3 w-14 rounded bg-charcoal-100 animate-pulse" />
            </div>

            {/* Product name */}
            <div className="space-y-2">
              <div className="h-10 w-3/4 rounded bg-charcoal-100 animate-pulse" />
              <div className="h-10 w-1/2 rounded bg-charcoal-100 animate-pulse" />
              <div className="h-3 w-28 rounded bg-charcoal-100 animate-pulse mt-2" />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-gold-200" />
              <div className="h-px flex-1 bg-charcoal-100" />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="h-3.5 w-full rounded bg-charcoal-100 animate-pulse" />
              <div className="h-3.5 w-5/6 rounded bg-charcoal-100 animate-pulse" />
              <div className="h-3.5 w-4/6 rounded bg-charcoal-100 animate-pulse" />
            </div>

            {/* Price */}
            <div className="flex items-end gap-3">
              <div className="h-10 w-28 rounded bg-charcoal-100 animate-pulse" />
              <div className="h-5 w-16 rounded bg-charcoal-100 animate-pulse mb-1" />
            </div>

            {/* Volume buttons */}
            <div>
              <div className="h-3 w-8 rounded bg-charcoal-100 animate-pulse mb-3" />
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-14 w-20 rounded bg-charcoal-100 animate-pulse" />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <div className="h-3 w-14 rounded bg-charcoal-100 animate-pulse mb-3" />
              <div className="h-11 w-36 rounded bg-charcoal-100 animate-pulse" />
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3">
              <div className="h-14 flex-1 rounded bg-gold-100 animate-pulse" />
              <div className="h-14 w-14 rounded bg-charcoal-100 animate-pulse" />
            </div>

            {/* Trust strip */}
            <div className="grid grid-cols-2 gap-3">
              <div className="h-14 rounded bg-cream-100 animate-pulse" />
              <div className="h-14 rounded bg-cream-100 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <div className="border-b border-charcoal-100 bg-cream-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="h-3 w-32 rounded bg-charcoal-100 animate-pulse" />
          <div className="mt-4 space-y-2">
            <div className="h-10 w-56 rounded bg-charcoal-100 animate-pulse" />
            <div className="h-3 w-40 rounded bg-charcoal-100 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex gap-10">
          {/* Sidebar skeleton */}
          <aside className="hidden lg:block w-56 flex-shrink-0 space-y-4">
            {[80, 60, 72, 50, 68].map((w, i) => (
              <div key={i} className={`h-3 w-${w} rounded bg-charcoal-100 animate-pulse`} />
            ))}
          </aside>

          {/* Grid skeleton */}
          <div className="flex-1 grid grid-cols-2 gap-6 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="aspect-[3/4] rounded bg-charcoal-100 animate-pulse" />
                <div className="h-3 w-16 rounded bg-charcoal-100 animate-pulse" />
                <div className="h-4 w-3/4 rounded bg-charcoal-100 animate-pulse" />
                <div className="h-3 w-20 rounded bg-charcoal-100 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

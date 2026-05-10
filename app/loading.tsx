export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-charcoal-200 border-t-gold-500 rounded-full animate-spin" />
        <p className="font-display text-charcoal-400 text-sm tracking-widest uppercase">
          Loading
        </p>
      </div>
    </div>
  );
}

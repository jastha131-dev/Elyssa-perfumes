import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-cream-50 pt-20">
      <div className="text-center max-w-md">
        <p className="text-gold-500 font-display text-sm tracking-[0.3em] uppercase mb-4">
          404
        </p>
        <h1 className="font-display text-4xl md:text-5xl text-charcoal-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-charcoal-500 mb-8 leading-relaxed">
          The page you&apos;re looking for seems to have evaporated like a
          delicate top note.
        </p>
        <Link
          href="/"
          className="inline-block bg-charcoal-900 text-white px-8 py-3 text-sm tracking-widest uppercase hover:bg-gold-500 transition-colors duration-300"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

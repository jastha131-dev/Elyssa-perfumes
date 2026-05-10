"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-gold-500 font-display text-sm tracking-[0.3em] uppercase mb-4">
          Something went wrong
        </p>
        <h2 className="font-display text-3xl text-charcoal-900 mb-4">
          An Error Occurred
        </h2>
        <p className="text-charcoal-500 mb-8">
          We apologize for the inconvenience. Please try again.
        </p>
        <button
          onClick={reset}
          className="bg-gold-500 text-white px-8 py-3 text-sm tracking-widest uppercase hover:bg-gold-600 transition-colors duration-300"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

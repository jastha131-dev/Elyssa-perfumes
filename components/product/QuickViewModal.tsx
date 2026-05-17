"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Heart, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from 'next-intl';
import { useCartStore } from "@/lib/store/cart-store";
import { useCartDrawerStore } from "@/lib/store/cart-drawer-store";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { formatPrice, cn } from "@/lib/utils";
import type { Product, VolumeOption } from "@/lib/types";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const INTENSITY_LABELS: Record<string, number> = {
  Light: 1, Moderate: 2, Strong: 3, Intense: 4,
};

function IntensityBar({ label }: { label: string }) {
  const level = INTENSITY_LABELS[label] ?? 2;
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 w-4 rounded-full transition-colors",
              i <= level ? "bg-gold-500" : "bg-charcoal-200"
            )}
          />
        ))}
      </div>
      <span className="text-[11px] text-charcoal-500">{label}</span>
    </div>
  );
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [selectedVolume, setSelectedVolume] = useState<VolumeOption | null>(null);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const t = useTranslations('product');
  const locale = useLocale();
  const isAr = locale === 'ar';
  const productName = product ? (isAr ? product.name_ar : product.name_en) : '';
  const { addItem } = useCartStore();
  const { openCart } = useCartDrawerStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const isWishlisted = product ? isInWishlist(product._id) : false;
  const images = product?.images ?? [];
  const hasMultipleImages = images.length > 1;

  useEffect(() => {
    if (product?.volume?.length) setSelectedVolume(product.volume[0]);
    setImageIndex(0);
    setAdded(false);
  }, [product]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setImageIndex((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setImageIndex((i) => Math.min(images.length - 1, i + 1));
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, images.length]);

  const handleAddToCart = useCallback(async () => {
    if (!product || !selectedVolume) return;
    setAdding(true);
    addItem(product, 1, selectedVolume);
    await new Promise((r) => setTimeout(r, 600));
    setAdding(false);
    setAdded(true);
    await new Promise((r) => setTimeout(r, 800));
    onClose();
    openCart();
  }, [product, selectedVolume, addItem, onClose, openCart]);

  const price = selectedVolume?.price ?? product?.price ?? 0;
  const discount =
    product?.compareAtPrice && product.compareAtPrice > price
      ? Math.round(((product.compareAtPrice - price) / product.compareAtPrice) * 100)
      : 0;

  return (
    <AnimatePresence>
      {isOpen && product && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-charcoal-950/70 backdrop-blur-md"
          />

          {/* Modal — static wrapper handles centering, motion div handles animation */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto w-full max-w-3xl overflow-hidden bg-white shadow-[0_32px_80px_-12px_rgba(0,0,0,0.4)]"
            style={{ maxHeight: '90vh' }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.1fr] h-full">

              {/* ── Image Column ────────────────────────────────────────────── */}
              <div className="relative bg-cream-100 overflow-hidden" style={{ minHeight: 380 }}>
                {/* Image */}
                <AnimatePresence mode="wait">
                  {images[imageIndex] ? (
                    <motion.div
                      key={imageIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={images[imageIndex].url}
                        alt={images[imageIndex].alt || productName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 95vw, 40vw"
                        priority
                      />
                    </motion.div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-cream-50 via-cream-100 to-cream-200">
                      <div className="h-px w-12 bg-gold-300/60" />
                      <span className="font-display text-8xl font-light italic text-charcoal-200 select-none">
                        {productName.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                      </span>
                      <div className="h-px w-12 bg-gold-300/60" />
                    </div>
                  )}
                </AnimatePresence>

                {/* Gradient overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-charcoal-950/30 to-transparent pointer-events-none" />

                {/* Badges */}
                <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                  {product.new && (
                    <span className="bg-charcoal-900 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white">
                      {t('new')}
                    </span>
                  )}
                  {product.bestSeller && (
                    <span className="bg-gold-500 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white">
                      {t('bestSeller')}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="bg-red-500 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white">
                      -{discount}%
                    </span>
                  )}
                </div>

                {/* Wishlist button on image */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={cn(
                    "absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200",
                    isWishlisted
                      ? "bg-red-500 text-white"
                      : "bg-white/90 text-charcoal-500 hover:bg-white hover:text-red-500 backdrop-blur-sm"
                  )}
                  aria-label={isWishlisted ? t('removeFromWishlist') : t('addToWishlist')}
                >
                  <Heart className={cn("h-3.5 w-3.5", isWishlisted && "fill-current")} />
                </button>

                {/* Image navigation */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={() => setImageIndex((i) => Math.max(0, i - 1))}
                      disabled={imageIndex === 0}
                      className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center bg-white/80 backdrop-blur-sm text-charcoal-700 disabled:opacity-30 hover:bg-white transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setImageIndex((i) => Math.min(images.length - 1, i + 1))}
                      disabled={imageIndex === images.length - 1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center bg-white/80 backdrop-blur-sm text-charcoal-700 disabled:opacity-30 hover:bg-white transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>

                    {/* Dot indicators */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setImageIndex(i)}
                          className={cn(
                            "h-1.5 rounded-full transition-all duration-200",
                            i === imageIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                          )}
                          aria-label={`Image ${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* ── Info Column ─────────────────────────────────────────────── */}
              <div className="flex flex-col overflow-y-auto" style={{ maxHeight: '90vh' }}>
                {/* Close */}
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 z-10 flex h-7 w-7 items-center justify-center text-charcoal-400 hover:text-charcoal-900 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="flex flex-1 flex-col gap-4 p-6 pt-7">
                  {/* Category + family */}
                  <div className="flex items-center gap-2">
                    {product.category && (
                      <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-500">
                        {isAr ? product.category.name_ar : product.category.name_en}
                      </span>
                    )}
                    {product.fragranceFamily && (
                      <>
                        <span className="text-charcoal-200">·</span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400">
                          {product.fragranceFamily}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Name */}
                  <div>
                    <h2 className="font-display text-2xl font-light text-charcoal-900 leading-tight">
                      {productName}
                    </h2>
                    <p className="mt-0.5 text-[11px] uppercase tracking-[0.25em] text-charcoal-400">
                      {t('eauDeParfum')}
                    </p>
                  </div>

                  {/* Thin divider */}
                  <div className="h-px bg-gradient-to-r from-gold-300/60 via-gold-200/40 to-transparent" />

                  {/* Description */}
                  {(isAr ? product.description_ar : product.description_en) && (
                    <p className="text-[13px] text-charcoal-600 leading-relaxed line-clamp-3">
                      {isAr ? product.description_ar : product.description_en}
                    </p>
                  )}

                  {/* Notes */}
                  {(product.topNotes_en?.length || product.middleNotes_en?.length || product.baseNotes_en?.length || product.topNotes_ar?.length || product.middleNotes_ar?.length || product.baseNotes_ar?.length) ? (
                    <div className="space-y-2">
                      {[
                        { label: t('top'), notes: (isAr ? product.topNotes_ar : product.topNotes_en) ?? [] },
                        { label: t('middle'), notes: (isAr ? product.middleNotes_ar : product.middleNotes_en) ?? [] },
                        { label: t('base'), notes: (isAr ? product.baseNotes_ar : product.baseNotes_en) ?? [] },
                      ].filter(({ notes }) => notes.length > 0).map(({ label, notes }) => (
                        <div key={label} className="flex items-start gap-2">
                          <span className="w-9 flex-shrink-0 pt-px text-[10px] uppercase tracking-[0.2em] text-charcoal-400">
                            {label}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {notes!.map((note: string) => (
                              <span
                                key={note}
                                className="rounded-sm bg-cream-100 px-2 py-0.5 text-[11px] text-charcoal-600"
                              >
                                {note}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {/* Intensity */}
                  {product.intensity && (
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal-400">{t('intensity')}</span>
                      <IntensityBar label={product.intensity} />
                    </div>
                  )}

                  {/* Divider */}
                  <div className="h-px bg-charcoal-100" />

                  {/* Price */}
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-2xl font-medium text-charcoal-900">
                      {formatPrice(price)}
                    </span>
                    {product.compareAtPrice && product.compareAtPrice > price && (
                      <>
                        <span className="text-sm text-charcoal-400 line-through">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                        <span className="rounded-sm bg-red-50 px-1.5 py-0.5 text-[11px] font-medium text-red-600">
                          {t('save', { percent: discount })}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Volume selector */}
                  {product.volume && product.volume.length > 0 && (
                    <div>
                      <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-charcoal-400">
                        {t('size')}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {product.volume.map((vol) => (
                          <button
                            key={vol.ml}
                            onClick={() => setSelectedVolume(vol)}
                            className={cn(
                              "relative px-4 py-2 text-xs border transition-all duration-200",
                              selectedVolume?.ml === vol.ml
                                ? "border-gold-500 bg-gold-50 text-gold-700 font-medium"
                                : "border-charcoal-200 text-charcoal-600 hover:border-charcoal-400"
                            )}
                          >
                            {vol.ml}ml
                            <span className={cn(
                              "block text-[10px] mt-0.5",
                              selectedVolume?.ml === vol.ml ? "text-gold-500" : "text-charcoal-400"
                            )}>
                              {formatPrice(vol.price)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Actions (pinned to bottom) ─────────────────────────── */}
                <div className="border-t border-charcoal-100 p-5 space-y-2.5 bg-white">
                  <button
                    onClick={handleAddToCart}
                    disabled={adding || added}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 py-3.5 text-sm font-medium uppercase tracking-[0.15em] transition-all duration-300",
                      added
                        ? "bg-green-600 text-white"
                        : "bg-charcoal-900 text-white hover:bg-gold-500"
                    )}
                  >
                    {adding ? (
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : added ? (
                      `${t('addedToBag')} ✓`
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4" />
                        {t('addToBag')}
                      </>
                    )}
                  </button>

                  <Link
                    href={`/products/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-center gap-1.5 py-2 text-[12px] uppercase tracking-[0.15em] text-charcoal-500 hover:text-gold-600 transition-colors"
                  >
                    {t('viewFullDetails')}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Global listener — mount once in Providers
export function QuickViewListener() {
  const [product, setProduct] = useState<Product | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handle = (e: CustomEvent<{ product: Product }>) => {
      setProduct(e.detail.product);
      setIsOpen(true);
    };
    window.addEventListener("luxe:quickview", handle as EventListener);
    return () => window.removeEventListener("luxe:quickview", handle as EventListener);
  }, []);

  return (
    <QuickViewModal product={product} isOpen={isOpen} onClose={() => setIsOpen(false)} />
  );
}

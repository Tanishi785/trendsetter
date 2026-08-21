import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, ShieldCheck, Truck, RefreshCw, Eye, Tag } from "lucide-react";
import { Product } from "../types";

interface HeroBannerProps {
  onExploreCollection: (categorySlug: string) => void;
  onOpenStylist: () => void;
  onSelectProduct: (product: Product) => void;
  featuredProducts: Product[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreCollection,
  onOpenStylist,
  onSelectProduct,
  featuredProducts,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = [
    {
      id: "slide-1",
      season: "SPRING / SUMMER 2026",
      title: "SCULPTED ELEGANCE",
      subtitle: "Architectural tailoring, pure Mongolian cashmere, and fluid Italian wool designed for contemporary movement.",
      modelTag: "Model Sasha (5'10\") in Atelier Trench & Fluid Trousers",
      categoryTarget: "minimalist",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=85",
      badge: "Editorial Spotlight",
      productId: "ts-001",
    },
    {
      id: "slide-2",
      season: "URBAN METROPOLIS",
      title: "NEO-TOKYO UTILITY",
      subtitle: "Tactile micro-ripstop overshirts and modular parachute pants. Designed for modern metropolitan nomads.",
      modelTag: "Model Julian (6'1\") in Boxy Utility Overshirt & 520GSM Hoodie",
      categoryTarget: "streetwear",
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=85",
      badge: "Streetwear Luxe Drop",
      productId: "ts-002",
    },
    {
      id: "slide-3",
      season: "HAUTE EVENING",
      title: "MIDNIGHT CHARMEUSE",
      subtitle: "Bias-cut Grade-6A mulberry silks and devoré crushed velvet capturing the glow of ambient city lights.",
      modelTag: "Model Clara (5'11\") in Silk Satin Column Gown & Velvet Blazer",
      categoryTarget: "evening",
      image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1600&q=85",
      badge: "Red Carpet Atelier",
      productId: "ts-004",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const current = heroSlides[activeSlide];

  return (
    <section className="relative w-full bg-neutral-950 text-white overflow-hidden">
      {/* Hero Canvas Area */}
      <div className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] flex items-center">
        {/* Background Image Carousel with Smooth Fade */}
        {heroSlides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === activeSlide ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center brightness-[0.78] contrast-[1.08]"
            />
            {/* Atmospheric gradient scrims for pristine legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/70 to-transparent w-full md:w-3/4" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/40" />
          </div>
        ))}

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-widest text-amber-300 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{current.badge}</span>
              <span className="text-white/40">•</span>
              <span className="text-white/90">{current.season}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase font-serif tracking-tight leading-[0.95] text-white drop-shadow-sm">
              {current.title}
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base sm:text-lg text-neutral-200 leading-relaxed font-light drop-shadow">
              {current.subtitle}
            </p>

            {/* Model outfit badge */}
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-neutral-700/60 text-xs text-neutral-300">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>{current.modelTag}</span>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                id="hero-explore-collection-btn"
                onClick={() => onExploreCollection(current.categoryTarget)}
                className="px-7 py-3.5 rounded-full bg-white text-neutral-950 hover:bg-neutral-200 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <span>Shop This Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-personal-stylist-btn"
                onClick={onOpenStylist}
                className="px-6 py-3.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-amber-300 hover:text-amber-200 border border-amber-400/40 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 backdrop-blur-md transition-all duration-200"
              >
                <Sparkles className="w-4 h-4" />
                <span>Get AI Style Match</span>
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Slide Indicators & Fast Nav */}
        <div className="absolute bottom-6 right-6 z-20 hidden sm:flex items-center gap-2 bg-neutral-950/80 backdrop-blur-md p-2 rounded-full border border-neutral-800">
          {heroSlides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setActiveSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === activeSlide ? "w-8 bg-amber-400" : "w-2 bg-neutral-600 hover:bg-neutral-400"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Value Proposition Ticker */}
      <div className="border-t border-neutral-800 bg-neutral-900/70 py-4 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 text-neutral-300">
            <Truck className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white">Global Express</p>
              <p className="text-[11px] text-neutral-400">Complimentary over $150</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3 text-neutral-300">
            <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white">AI Personal Stylist</p>
              <p className="text-[11px] text-neutral-400">Bespoke capsule recommendations</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3 text-neutral-300">
            <RefreshCw className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white">30-Day Easy Returns</p>
              <p className="text-[11px] text-neutral-400">Prepaid courier return labels</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3 text-neutral-300">
            <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white">100% Ethical Luxury</p>
              <p className="text-[11px] text-neutral-400">Certified mills & master tailors</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

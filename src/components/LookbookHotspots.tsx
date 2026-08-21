import React, { useState } from "react";
import { Sparkles, Eye, ShoppingBag, ArrowRight } from "lucide-react";
import { Product } from "../types";
import { LOOKBOOK_EDITORIALS } from "../data/products";

interface LookbookHotspotsProps {
  products: Product[];
  onSelectProduct: (p: Product) => void;
}

export const LookbookHotspots: React.FC<LookbookHotspotsProps> = ({
  products,
  onSelectProduct,
}) => {
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const look = LOOKBOOK_EDITORIALS[activeLookIndex];

  return (
    <section className="w-full bg-neutral-950 py-16 px-4 sm:px-6 lg:px-8 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Editorial Lookbook</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase font-serif tracking-tight text-white">
              Shop The Runway Outfits
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1 max-w-xl">
              Tap the glowing pins on the models to inspect individual garment cuts, fabric weights, and instantly shop the look.
            </p>
          </div>

          {/* Lookbook Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {LOOKBOOK_EDITORIALS.map((l, idx) => (
              <button
                key={l.id}
                onClick={() => {
                  setActiveLookIndex(idx);
                  setActiveHotspot(null);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  idx === activeLookIndex
                    ? "bg-white text-neutral-950 shadow-md"
                    : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                Look 0{idx + 1}: {l.title}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Lookbook Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Main Interactive Stage with Model & Hotspots */}
          <div className="lg:col-span-8 relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl">
            <img
              src={look.image}
              alt={look.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent pointer-events-none" />

            {/* Model & Location Tag */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10">
              <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-neutral-700 text-xs font-semibold text-amber-300">
                {look.season} • {look.location}
              </span>
              <h3 className="text-xl sm:text-2xl font-black uppercase font-serif text-white mt-1">
                {look.title}
              </h3>
            </div>

            {/* Pulsing Hotspot Pins */}
            {look.hotspots.map((h, i) => {
              const matchedProduct = products.find((p) => p.id === h.productId);
              const isHovered = activeHotspot === h.productId;

              return (
                <div
                  key={i}
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  {/* Glowing Pulse Button */}
                  <button
                    onClick={() => {
                      if (matchedProduct) onSelectProduct(matchedProduct);
                    }}
                    onMouseEnter={() => setActiveHotspot(h.productId)}
                    className="relative group w-8 h-8 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center font-bold text-xs shadow-lg shadow-amber-500/50 hover:scale-125 transition-transform"
                    aria-label={`Shop ${h.label}`}
                  >
                    <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-75" />
                    <span className="relative z-10 text-[11px] font-black">+</span>
                  </button>

                  {/* Floating Garment Tooltip */}
                  {isHovered && matchedProduct && (
                    <div
                      onClick={() => onSelectProduct(matchedProduct)}
                      className="absolute left-1/2 -translate-x-1/2 bottom-10 w-48 sm:w-56 p-2.5 rounded-2xl bg-neutral-950/95 backdrop-blur-md border border-amber-400 shadow-2xl text-left cursor-pointer z-30 animate-in fade-in zoom-in-95 duration-150"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={matchedProduct.images.main}
                          alt={matchedProduct.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-14 object-cover rounded-lg bg-neutral-900 flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-bold text-white truncate font-serif">
                            {matchedProduct.name}
                          </p>
                          <p className="text-[10px] text-amber-300 font-extrabold mt-0.5">
                            ${matchedProduct.price}
                          </p>
                          <p className="text-[9px] text-neutral-400 uppercase font-semibold mt-0.5">
                            Tap to Inspect Outfit →
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Outfit Breakdown List */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">
                Items in This Outfit:
              </h4>

              <div className="space-y-3">
                {look.hotspots.map((h, i) => {
                  const item = products.find((p) => p.id === h.productId);
                  if (!item) return null;

                  return (
                    <div
                      key={i}
                      onClick={() => onSelectProduct(item)}
                      onMouseEnter={() => setActiveHotspot(item.id)}
                      onMouseLeave={() => setActiveHotspot(null)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-400 cursor-pointer transition-all group"
                    >
                      <img
                        src={item.images.main}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-16 object-cover rounded-lg bg-neutral-900 flex-shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                          Piece 0{i + 1}
                        </span>
                        <h5 className="text-xs font-bold text-white truncate font-serif mt-0.5">
                          {item.name}
                        </h5>
                        <p className="text-[11px] text-neutral-400 truncate">{item.subtitle}</p>
                        <p className="text-xs font-extrabold text-white mt-1">${item.price}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

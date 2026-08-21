import React from "react";
import { ArrowUpRight, Sparkles, SlidersHorizontal, Check } from "lucide-react";
import { CategoryInfo, Product } from "../types";
import { CATEGORIES } from "../data/products";

interface CategoryNavProps {
  selectedCategory: string;
  onSelectCategory: (categorySlug: string) => void;
  selectedGender: string;
  onSelectGender: (gender: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedGender,
  onSelectGender,
  sortBy,
  onSortChange,
}) => {
  return (
    <section className="w-full bg-neutral-900/60 py-12 px-4 sm:px-6 lg:px-8 border-y border-neutral-800/80">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Collections</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase font-serif tracking-tight text-white">
              Navigate Fashion Capsules
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1 max-w-xl">
              Click any aesthetic capsule below to discover tailored outfits worn by runway & street models.
            </p>
          </div>

          {/* Quick Gender & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-neutral-950 p-1 rounded-full border border-neutral-800 flex items-center">
              {[
                { label: "All Fits", value: "all" },
                { label: "Women", value: "women" },
                { label: "Men", value: "men" },
                { label: "Unisex", value: "unisex" },
              ].map((g) => (
                <button
                  key={g.value}
                  id={`filter-gender-${g.value}`}
                  onClick={() => onSelectGender(g.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider transition-colors ${
                    selectedGender === g.value
                      ? "bg-white text-neutral-950 font-bold shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1 bg-neutral-950 px-3 py-1.5 rounded-full border border-neutral-800 text-xs text-neutral-300">
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
              <select
                id="sort-by-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                aria-label="Sort products"
                className="bg-transparent text-white text-xs font-medium focus:outline-none cursor-pointer"
              >
                <option value="featured" className="bg-neutral-950">Featured Trends</option>
                <option value="price-asc" className="bg-neutral-950">Price: Low to High</option>
                <option value="price-desc" className="bg-neutral-950">Price: High to Low</option>
                <option value="rating" className="bg-neutral-950">Highest Rated</option>
                <option value="newest" className="bg-neutral-950">New Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Clickable Visual Fashion Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <div
                key={cat.id}
                id={`category-card-${cat.slug}`}
                onClick={() => onSelectCategory(cat.slug)}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 transform border ${
                  isSelected
                    ? "ring-2 ring-amber-400 border-amber-400/80 scale-[1.02] shadow-xl shadow-amber-500/10"
                    : "border-neutral-800/80 hover:border-neutral-600 hover:scale-[1.01]"
                }`}
              >
                {/* Image Container with Model Outfit */}
                <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-950 relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Subtle Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

                  {/* Badge */}
                  {cat.featuredBadge && (
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-neutral-950/80 backdrop-blur-md border border-neutral-700 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                      {cat.featuredBadge}
                    </span>
                  )}

                  {/* Selected Indicator */}
                  {isSelected && (
                    <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}

                  {/* Text Overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col justify-end">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base sm:text-lg font-black uppercase font-serif text-white group-hover:text-amber-300 transition-colors">
                        {cat.name}
                      </h3>
                      <div className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-white text-white group-hover:text-black flex items-center justify-center transition-all">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <p className="text-[11px] text-neutral-300 line-clamp-1 mt-0.5 font-light">
                      {cat.tagline}
                    </p>
                    <div className="mt-2 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                      {cat.itemCount} Designer Pieces
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

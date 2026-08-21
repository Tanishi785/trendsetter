import React, { useState } from "react";
import { Heart, Eye, ShoppingBag, Star, Sparkles, Check } from "lucide-react";
import { Product, ProductColor } from "../types";

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product, color: ProductColor, size: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onQuickAdd,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const displayImage = isHovered
    ? product.images.modelLook1 || product.images.main
    : selectedColor.image || product.images.main;

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes[1] || product.sizes[0];
    onQuickAdd(product, selectedColor, defaultSize);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-neutral-900/40 rounded-2xl overflow-hidden border border-neutral-800/80 hover:border-neutral-700 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-black/60"
    >
      {/* Product Image Frame with Model Outfit */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-950">
        <img
          src={displayImage}
          alt={`${product.name} worn by model`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-neutral-950 text-[10px] font-extrabold uppercase tracking-wider shadow-md">
              New Arrival
            </span>
          )}
          {product.isTrending && (
            <span className="px-2.5 py-0.5 rounded-full bg-neutral-900/90 backdrop-blur-md border border-neutral-700 text-neutral-200 text-[10px] font-bold uppercase tracking-wider">
              Trending
            </span>
          )}
          {discountPercent && (
            <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
              Save {discountPercent}%
            </span>
          )}
          {product.matchScore && (
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-neutral-950 text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              {product.matchScore}% Match
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
            isWishlisted
              ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-110"
              : "bg-neutral-950/70 hover:bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-700/50"
          }`}
          aria-label="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-white" : ""}`} />
        </button>

        {/* Model Fit Badge Overlay */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
          <div className="px-2.5 py-1 rounded-md bg-neutral-950/80 backdrop-blur-md border border-neutral-800 text-[10px] text-neutral-300 font-medium">
            {product.modelStats.height} • {product.modelStats.wearingSize}
          </div>
        </div>

        {/* Quick View & Quick Add Action Buttons on Hover */}
        <div className="absolute inset-x-3 bottom-12 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleQuickAddClick}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xl transition-all ${
              addedAnimation
                ? "bg-emerald-500 text-white"
                : "bg-white text-neutral-950 hover:bg-amber-300"
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="p-2.5 rounded-xl bg-neutral-950/90 text-white hover:bg-neutral-800 border border-neutral-700 text-xs flex items-center justify-center shadow-lg"
            aria-label="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
            <span className="uppercase tracking-wider font-semibold text-[11px] text-neutral-400">
              {product.categoryLabel}
            </span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" />
              <span className="text-white font-medium text-xs">{product.rating}</span>
              <span className="text-neutral-500 text-[10px]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1 font-serif">
            {product.name}
          </h3>

          {/* Subtitle */}
          <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5 font-light">
            {product.subtitle}
          </p>
        </div>

        {/* Bottom: Colors Swatch & Price */}
        <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
          {/* Color swatches */}
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {product.colors.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedColor(c)}
                title={c.name}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  selectedColor.name === c.name
                    ? "ring-2 ring-amber-400 ring-offset-1 ring-offset-neutral-950 scale-110 border-white"
                    : "border-neutral-600 hover:scale-105"
                }`}
                style={{ backgroundColor: c.hex }}
                aria-label={`Select color ${c.name}`}
              />
            ))}
            <span className="text-[10px] text-neutral-500 ml-1">
              {product.colors.length} {product.colors.length === 1 ? "color" : "colors"}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            {product.originalPrice && (
              <span className="text-xs text-neutral-500 line-through">
                ${product.originalPrice}
              </span>
            )}
            <span className="text-sm sm:text-base font-black text-white">
              ${product.price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { Product, ProductColor } from "../types";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemoveWishlist: (product: Product) => void;
  onAddToCart: (product: Product, color: ProductColor, size: string, quantity: number) => void;
  onSelectProduct: (p: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveWishlist,
  onAddToCart,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div
        id="wishlist-drawer-container"
        className="w-full max-w-md bg-neutral-950 text-white h-full shadow-2xl flex flex-col justify-between border-l border-neutral-800 animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="text-base font-bold uppercase tracking-wider font-serif text-white">
              Saved Pieces ({items.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500">
                <Heart className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white uppercase font-serif">
                  No Saved Pieces Yet
                </h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                  Tap the heart icon on any model look to save it to your private styling wishlist.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-white text-neutral-950 font-bold text-xs uppercase tracking-wider hover:bg-neutral-200"
              >
                Browse Outfits
              </button>
            </div>
          ) : (
            items.map((product) => (
              <div
                key={product.id}
                className="flex gap-3 p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800/80"
              >
                <img
                  src={product.images.main}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="w-18 h-22 object-cover object-top rounded-xl bg-neutral-950 flex-shrink-0 cursor-pointer"
                />

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <div
                      className="min-w-0 cursor-pointer"
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                    >
                      <h4 className="text-xs font-bold text-white truncate font-serif">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-neutral-400 truncate">
                        {product.categoryLabel}
                      </p>
                      <p className="text-xs font-black text-amber-300 mt-1">${product.price}</p>
                    </div>
                    <button
                      onClick={() => onRemoveWishlist(product)}
                      className="text-neutral-500 hover:text-rose-400 p-1"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      onAddToCart(product, product.colors[0], product.sizes[1] || product.sizes[0], 1);
                      onRemoveWishlist(product);
                    }}
                    className="mt-2 py-2 px-3 rounded-xl bg-neutral-800 hover:bg-white text-white hover:text-neutral-950 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-neutral-800 bg-neutral-900">
            <button
              onClick={() => {
                items.forEach((item) => {
                  onAddToCart(item, item.colors[0], item.sizes[1] || item.sizes[0], 1);
                });
                onClose();
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add All to Bag ({items.length} Items)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

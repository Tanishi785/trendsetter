import React, { useState } from "react";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Tag,
  ShieldCheck,
  Truck,
  Check,
} from "lucide-react";
import { CartItem } from "../types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onOpenCheckout: () => void;
  appliedPromo: { code: string; discountPercent: number; discountFixed: number } | null;
  onApplyPromo: (code: string) => boolean;
  onRemovePromo: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onOpenCheckout,
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
}) => {
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState(false);

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 150;
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercent > 0) {
      discountAmount = (subtotal * appliedPromo.discountPercent) / 100;
    } else if (appliedPromo.discountFixed > 0) {
      discountAmount = appliedPromo.discountFixed;
    }
  }

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 15;
  const total = Math.max(0, subtotal - discountAmount + shippingCost);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const ok = onApplyPromo(promoInput.trim());
    if (ok) {
      setPromoSuccess(true);
      setPromoError("");
      setTimeout(() => setPromoSuccess(false), 2000);
    } else {
      setPromoError("Invalid code. Try TREND15 or VIPSTYLIST");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div
        id="cart-drawer-container"
        className="w-full max-w-md bg-neutral-950 text-white h-full shadow-2xl flex flex-col justify-between border-l border-neutral-800 animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold uppercase tracking-wider font-serif text-white">
              Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            id="close-cart-btn"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="p-4 bg-neutral-900/40 border-b border-neutral-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-neutral-300 font-medium flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              {remainingForFreeShipping === 0 ? (
                <span className="text-emerald-400 font-bold">
                  Free Priority Express Unlocked!
                </span>
              ) : (
                <span>
                  Add <strong className="text-white">${remainingForFreeShipping}</strong> for Free Express
                </span>
              )}
            </span>
            <span className="text-[11px] text-neutral-400 font-mono">
              {progressPercent.toFixed(0)}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white uppercase font-serif">
                  Your bag is empty
                </h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                  Explore our latest runway drops and curated model collections to add luxury garments.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-white text-neutral-950 font-bold text-xs uppercase tracking-wider hover:bg-neutral-200"
              >
                Discover Collections
              </button>
            </div>
          ) : (
            items.map((item, index) => (
              <div
                key={`${item.product.id}-${item.selectedColor.name}-${item.selectedSize}`}
                className="flex gap-3 p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800/80"
              >
                {/* Product Thumbnail */}
                <img
                  src={item.selectedColor.image || item.product.images.main}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-18 h-22 object-cover object-top rounded-xl bg-neutral-950 flex-shrink-0"
                />

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate font-serif">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-neutral-400 truncate">
                        {item.selectedColor.name} • Size {item.selectedSize}
                      </p>
                    </div>
                    <button
                      onClick={() => onRemoveItem(index)}
                      className="text-neutral-500 hover:text-rose-400 p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg p-0.5">
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-amber-300">
                        ${(item.product.price * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Checkout Actions */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-neutral-800 bg-neutral-900/90 space-y-4">
            {/* Promo Code Box */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  placeholder="Promo Code (e.g. TREND15)"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white uppercase placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Apply
              </button>
            </form>

            {promoError && <p className="text-[11px] text-rose-400">{promoError}</p>}
            {appliedPromo && (
              <div className="flex items-center justify-between text-xs text-emerald-400 bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/50">
                <span>Code &apos;{appliedPromo.code}&apos; Applied</span>
                <button
                  onClick={onRemovePromo}
                  className="text-neutral-400 hover:text-white text-[10px] underline"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Pricing Summary */}
            <div className="space-y-1.5 text-xs text-neutral-300 pt-2 border-t border-neutral-800">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-white">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Express Delivery</span>
                <span>{shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-neutral-800">
                <span>Total</span>
                <span className="text-amber-300 text-base">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Seamless Checkout Button */}
            <button
              id="proceed-checkout-btn"
              onClick={() => {
                onClose();
                onOpenCheckout();
              }}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-neutral-950 font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl hover:scale-[1.02] active:scale-98 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Proceed to Seamless Checkout • ${total.toFixed(2)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-3 text-[10px] text-neutral-400">
              <span>🔒 256-Bit Encrypted</span>
              <span>•</span>
              <span>Apple Pay & Cards</span>
              <span>•</span>
              <span>Klarna 0% APR</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

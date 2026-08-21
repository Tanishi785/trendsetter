import React, { useState } from "react";
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  RefreshCw,
  ShoppingBag,
  Heart,
  Sparkles,
  Check,
  Ruler,
  Info,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";
import { Product, ProductColor, CartItem } from "../types";
import { REVIEWS_SAMPLE } from "../data/products";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, color: ProductColor, size: string, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  allProducts,
  onSelectProduct,
}) => {
  if (!product) return null;

  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[1] || product.sizes[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string>(product.images.main);
  const [showFitCalculator, setShowFitCalculator] = useState(false);
  const [userHeight, setUserHeight] = useState<number>(172);
  const [userWeight, setUserWeight] = useState<number>(64);
  const [activeTab, setActiveTab] = useState<"details" | "care" | "styling" | "reviews">("details");
  const [isAdded, setIsAdded] = useState(false);

  const imagesList = [
    { label: "Model Full Look", url: product.images.main },
    { label: "Runway Angle", url: product.images.modelLook1 },
    { label: "Street Movement", url: product.images.modelLook2 },
    { label: "Fabric Close-up", url: product.images.detail },
  ];

  // Calculate recommended size from height/weight
  const calculateRecommendedSize = () => {
    if (userHeight < 165) return product.sizes[0] || "XS";
    if (userHeight < 175) return product.sizes[1] || "S";
    if (userHeight < 183) return product.sizes[2] || "M";
    return product.sizes[3] || "L";
  };

  const recommendedSize = calculateRecommendedSize();

  const handleAdd = () => {
    onAddToCart(product, selectedColor, selectedSize, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Find complementary products for "Complete the Look"
  const completeTheLookProducts = allProducts.filter(
    (p) => product.completeTheLookIds?.includes(p.id) && p.id !== product.id
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      {/* Modal Container */}
      <div
        id="product-detail-modal-container"
        className="relative w-full max-w-5xl bg-neutral-950 text-white rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-product-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/80 transition-colors shadow-lg"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left: Interactive Model Gallery */}
          <div className="lg:col-span-6 bg-neutral-900/60 p-4 sm:p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-neutral-800">
            {/* Main Stage Image with Model */}
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800/80">
              <img
                src={selectedImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top transition-all duration-300"
              />

              {/* Model overlay pill */}
              <div className="absolute bottom-3 left-3 bg-neutral-950/80 backdrop-blur-md border border-neutral-700 px-3 py-1 rounded-full text-xs text-neutral-300 flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Outfit worn by {product.modelStats.height} Model</span>
              </div>
            </div>

            {/* Thumbnails Row */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 mt-4">
              {imagesList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img.url)}
                  className={`relative aspect-[3/4] rounded-xl overflow-hidden border transition-all ${
                    selectedImage === img.url
                      ? "ring-2 ring-amber-400 border-amber-400 scale-102"
                      : "border-neutral-800 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.label}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                </button>
              ))}
            </div>

            {/* Model Fit Callout Card */}
            <div className="mt-4 p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
              <div className="flex items-center justify-between text-neutral-300 font-semibold mb-1">
                <span className="uppercase tracking-wider text-[10px] text-amber-400">
                  Model Specifications
                </span>
                <span className="text-neutral-400">{product.modelStats.wearingSize}</span>
              </div>
              <p className="text-neutral-300 text-xs leading-relaxed">
                {product.modelStats.fitNotes}
              </p>
            </div>
          </div>

          {/* Right: Product Customization & Ordering Form */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-amber-300 font-bold uppercase tracking-widest text-[10px]">
                  {product.categoryLabel}
                </span>
                <div className="flex items-center gap-1.5 text-amber-400">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-white font-bold">{product.rating}</span>
                  <span className="text-neutral-500">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Title & Price */}
              <h1 className="text-2xl sm:text-3xl font-black uppercase font-serif text-white mt-3">
                {product.name}
              </h1>
              <p className="text-sm text-neutral-400 font-light mt-1">
                {product.subtitle}
              </p>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-neutral-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
                <span className="text-xs text-neutral-400">
                  or 4 interest-free payments of ${(product.price / 4).toFixed(2)} with Klarna
                </span>
              </div>

              {/* Color Selection */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-neutral-400 font-semibold uppercase tracking-wider">
                    Color: <span className="text-white font-bold">{selectedColor.name}</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => {
                        setSelectedColor(color);
                        if (color.image) setSelectedImage(color.image);
                      }}
                      className={`group relative p-1 rounded-full transition-all ${
                        selectedColor.name === color.name
                          ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-neutral-950"
                          : "opacity-80 hover:opacity-100"
                      }`}
                    >
                      <span
                        className="block w-7 h-7 rounded-full border border-neutral-700 shadow-inner"
                        style={{ backgroundColor: color.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection & Fit Advisor */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-neutral-400 font-semibold uppercase tracking-wider">
                    Select Size: <span className="text-white font-bold">{selectedSize}</span>
                  </span>

                  <button
                    onClick={() => setShowFitCalculator(!showFitCalculator)}
                    className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 font-medium underline text-xs"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Fit Advisor</span>
                  </button>
                </div>

                {/* Size Pills */}
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                          isSelected
                            ? "bg-white text-neutral-950 border-white shadow-md scale-102"
                            : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-600"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>

                {/* Interactive Fit Advisor Drawer */}
                {showFitCalculator && (
                  <div className="mt-3 p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI Silhouette Fit Recommender
                      </span>
                      <button
                        onClick={() => setShowFitCalculator(false)}
                        className="text-neutral-400 hover:text-white text-xs"
                      >
                        Close
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-neutral-400 block mb-1">Your Height: {userHeight} cm</label>
                        <input
                          type="range"
                          min="150"
                          max="200"
                          value={userHeight}
                          onChange={(e) => setUserHeight(Number(e.target.value))}
                          className="w-full accent-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-neutral-400 block mb-1">Your Weight: {userWeight} kg</label>
                        <input
                          type="range"
                          min="45"
                          max="110"
                          value={userWeight}
                          onChange={(e) => setUserWeight(Number(e.target.value))}
                          className="w-full accent-amber-400"
                        />
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-neutral-800 flex items-center justify-between">
                      <span className="text-xs text-neutral-300">
                        Recommended Size: <strong className="text-white text-sm">{recommendedSize}</strong> (96% Confidence)
                      </span>
                      <button
                        onClick={() => setSelectedSize(recommendedSize)}
                        className="px-3 py-1 rounded-lg bg-amber-400 text-neutral-950 font-bold text-xs"
                      >
                        Apply {recommendedSize}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity & CTA Buttons */}
              <div className="mt-8 flex items-center gap-3">
                {/* Quantity Controls */}
                <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-2xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-10 flex items-center justify-center text-neutral-400 hover:text-white text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-10 flex items-center justify-center text-neutral-400 hover:text-white text-sm font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Big Add to Bag Button */}
                <button
                  id="add-to-bag-modal-btn"
                  onClick={handleAdd}
                  className={`flex-1 py-4 px-6 rounded-2xl text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl transition-all duration-200 ${
                    isAdded
                      ? "bg-emerald-500 text-white"
                      : "bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-neutral-950 hover:scale-[1.02] active:scale-98"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5 stroke-[3]" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>Add to Bag • ${(product.price * quantity).toFixed(0)}</span>
                    </>
                  )}
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-4 rounded-2xl border transition-all ${
                    isWishlisted
                      ? "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/30"
                      : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white"
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-white" : ""}`} />
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-2 pt-6 mt-6 border-t border-neutral-800/80 text-[11px] text-neutral-400 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>Express 2-Day Shipping</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RefreshCw className="w-4 h-4 text-amber-400" />
                  <span>30-Day Free Returns</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Certified Ethical Atelier</span>
                </div>
              </div>

              {/* Tabs Section (Details, Care, Styling, Reviews) */}
              <div className="mt-8">
                <div className="flex border-b border-neutral-800">
                  {[
                    { id: "details", label: "Details & Fabric" },
                    { id: "styling", label: "Stylist Notes" },
                    { id: "care", label: "Care Guide" },
                    { id: "reviews", label: `Reviews (${product.reviewsCount})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`pb-2 px-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? "border-amber-400 text-white"
                          : "border-transparent text-neutral-500 hover:text-neutral-300"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="py-4 text-xs text-neutral-300 leading-relaxed">
                  {activeTab === "details" && (
                    <div className="space-y-3">
                      <p>{product.description}</p>
                      <ul className="list-disc list-inside space-y-1 text-neutral-400">
                        {product.fabricDetails.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeTab === "styling" && (
                    <div className="space-y-2">
                      <p className="text-amber-300 font-semibold">Atelier Styling Director Tip:</p>
                      <ul className="space-y-1.5 text-neutral-300">
                        {product.stylingTips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-amber-400">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeTab === "care" && (
                    <div className="space-y-2">
                      <ul className="list-disc list-inside space-y-1 text-neutral-400">
                        {product.careInstructions.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeTab === "reviews" && (
                    <div className="space-y-3">
                      {REVIEWS_SAMPLE.map((rev) => (
                        <div key={rev.id} className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{rev.author}</span>
                              <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[9px] font-semibold">
                                Verified
                              </span>
                            </div>
                            <div className="flex text-amber-400">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className="w-3 h-3 fill-amber-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs font-semibold text-neutral-200">{rev.title}</p>
                          <p className="text-[11px] text-neutral-400 mt-1">{rev.comment}</p>
                          <div className="mt-2 text-[10px] text-neutral-500">
                            Fit: {rev.fitFeedback} • Size: {rev.sizePurchased} • Height: {rev.height}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Complete The Look Recommendations */}
              {completeTheLookProducts.length > 0 && (
                <div className="mt-6 pt-6 border-t border-neutral-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Complete The Atelier Look
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {completeTheLookProducts.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onSelectProduct(item)}
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800/80 border border-neutral-800 cursor-pointer transition-colors"
                      >
                        <img
                          src={item.images.main}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-14 object-cover rounded-lg bg-neutral-950 flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-bold text-white truncate">{item.name}</p>
                          <p className="text-[10px] text-amber-400 font-semibold mt-0.5">${item.price}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-500 mr-1" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

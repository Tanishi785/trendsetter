import React, { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  ShoppingBag,
  Heart,
  SlidersHorizontal,
  ArrowRight,
  Filter,
  Check,
  RefreshCw,
  Eye,
} from "lucide-react";
import { Product, ProductColor, CartItem, OrderConfirmation } from "./types";
import { PRODUCTS, CATEGORIES } from "./data/products";
import { Navbar } from "./components/Navbar";
import { HeroBanner } from "./components/HeroBanner";
import { CategoryNav } from "./components/CategoryNav";
import { ProductCard } from "./components/ProductCard";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { PersonalizedStylistModal } from "./components/PersonalizedStylistModal";
import { LookbookHotspots } from "./components/LookbookHotspots";
import { CartDrawer } from "./components/CartDrawer";
import { WishlistDrawer } from "./components/WishlistDrawer";
import { SeamlessCheckoutModal } from "./components/SeamlessCheckoutModal";
import { Footer } from "./components/Footer";

export default function App() {
  // Local storage state initialization
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("trendsetter_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem("trendsetter_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI state
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Modals and Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isStylistOpen, setIsStylistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Active Promo Code
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountPercent: number;
    discountFixed: number;
  } | null>(null);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist cart and wishlist
  useEffect(() => {
    try {
      localStorage.setItem("trendsetter_cart", JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("trendsetter_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cart operations
  const handleAddToCart = (
    product: Product,
    color: ProductColor,
    size: string,
    quantity: number = 1
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor.name === color.name &&
          item.selectedSize === size
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      } else {
        return [...prev, { product, selectedColor: color, selectedSize: size, quantity }];
      }
    });

    showToast(`Added ${quantity}x "${product.name}" to your bag`);
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(index);
    } else {
      setCart((prev) => {
        const next = [...prev];
        next[index].quantity = quantity;
        return next;
      });
    }
  };

  const handleRemoveFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    showToast("Item removed from bag");
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Wishlist toggle
  const handleToggleWishlist = (product: Product) => {
    const exists = wishlist.some((p) => p.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((p) => p.id !== product.id));
      showToast(`Removed "${product.name}" from wishlist`);
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast(`Saved "${product.name}" to private wishlist ❤️`);
    }
  };

  // Promo code validation
  const handleApplyPromo = (code: string) => {
    const upper = code.toUpperCase();
    if (upper === "TREND15") {
      setAppliedPromo({ code: "TREND15", discountPercent: 15, discountFixed: 0 });
      showToast("15% off applied!");
      return true;
    } else if (upper === "VIPSTYLIST") {
      setAppliedPromo({ code: "VIPSTYLIST", discountPercent: 20, discountFixed: 0 });
      showToast("VIP 20% off applied!");
      return true;
    } else if (upper === "FIRSTLOOK") {
      setAppliedPromo({ code: "FIRSTLOOK", discountPercent: 0, discountFixed: 20 });
      showToast("$20 first-order voucher applied!");
      return true;
    }
    return false;
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    showToast("Promo code removed");
  };

  // Filter and Sort Products
  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    // Filter by category
    if (selectedCategory && selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Filter by gender
    if (selectedGender && selectedGender !== "all") {
      list = list.filter((p) => p.gender === selectedGender || p.gender === "unisex");
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "newest") {
      list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return list;
  }, [selectedCategory, selectedGender, searchQuery, sortBy]);

  const activeCategoryInfo = CATEGORIES.find((c) => c.slug === selectedCategory);

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col font-sans selection:bg-amber-400 selection:text-neutral-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-neutral-900/95 text-white border border-amber-400/80 shadow-2xl backdrop-blur-md text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenStylist={() => setIsStylistOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          // Smooth scroll to catalog
          const el = document.getElementById("collection-catalog-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        products={PRODUCTS}
        onSelectProduct={setSelectedProduct}
      />

      {/* Hero Showcase with Fashion Models Wearing Latest Outfits */}
      <HeroBanner
        onExploreCollection={(categorySlug) => {
          setSelectedCategory(categorySlug);
          const el = document.getElementById("collection-catalog-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        onOpenStylist={() => setIsStylistOpen(true)}
        onSelectProduct={setSelectedProduct}
        featuredProducts={PRODUCTS.slice(0, 3)}
      />

      {/* Clickable Categories Fashion Capsules Navigation */}
      <CategoryNav
        selectedCategory={selectedCategory}
        onSelectCategory={(categorySlug) => {
          setSelectedCategory(categorySlug);
          const el = document.getElementById("collection-catalog-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        selectedGender={selectedGender}
        onSelectGender={setSelectedGender}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Interactive Lookbook: Shop The Models' Outfits */}
      <LookbookHotspots
        products={PRODUCTS}
        onSelectProduct={setSelectedProduct}
      />

      {/* Main Fashion Catalog Grid Section */}
      <main id="collection-catalog-section" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {selectedCategory === "all"
                  ? "Full Runway & Street Catalog"
                  : `${activeCategoryInfo?.name || selectedCategory} Capsule`}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase font-serif tracking-tight text-white">
              {selectedCategory === "all" ? "Latest Clothing Styles" : activeCategoryInfo?.name}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl font-light">
              {activeCategoryInfo?.tagline ||
                "Inspected and worn by atelier runway models with transparent fit metrics and fabric composition."}
            </p>
          </div>

          {/* Quick Active Filter Badges */}
          <div className="flex items-center gap-2">
            {selectedCategory !== "all" && (
              <button
                onClick={() => setSelectedCategory("all")}
                className="px-3 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs text-neutral-300 flex items-center gap-1.5 transition-colors"
              >
                <span>Category: {activeCategoryInfo?.name || selectedCategory}</span>
                <span className="text-neutral-500 font-bold">×</span>
              </button>
            )}
            {selectedGender !== "all" && (
              <button
                onClick={() => setSelectedGender("all")}
                className="px-3 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs text-neutral-300 flex items-center gap-1.5 transition-colors"
              >
                <span className="capitalize">Fit: {selectedGender}</span>
                <span className="text-neutral-500 font-bold">×</span>
              </button>
            )}
            <span className="text-xs text-neutral-500 font-semibold ml-2">
              Showing {filteredProducts.length} Styles
            </span>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-neutral-900/30 rounded-3xl border border-neutral-800">
            <h3 className="text-lg font-bold text-white uppercase font-serif">
              No matching garments found
            </h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              We couldn&apos;t find styles matching your current filters. Try resetting the category or search keywords.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedGender("all");
                setSearchQuery("");
              }}
              className="px-6 py-2.5 rounded-full bg-white text-neutral-950 font-bold text-xs uppercase tracking-wider hover:bg-neutral-200"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={setSelectedProduct}
                onQuickAdd={(prod, color, size) => handleAddToCart(prod, color, size, 1)}
                isWishlisted={wishlist.some((p) => p.id === product.id)}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        )}

        {/* AI Stylist Mid-Page Banner */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border border-amber-400/40 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-xl space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Fashion Consultation</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase font-serif text-white">
              Unsure How To Style These Pieces?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
              Take our 60-second interactive AI Style Quiz. Our Runway Styling Engine will analyze your event, preferred silhouettes, and skin tone palette to curate complete head-to-toe capsules.
            </p>
          </div>

          <button
            onClick={() => setIsStylistOpen(true)}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-neutral-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 shadow-2xl hover:scale-105 active:scale-95 transition-all flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Style Matcher</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <Footer
        onOpenStylist={() => setIsStylistOpen(true)}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          const el = document.getElementById("collection-catalog-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        isWishlisted={selectedProduct ? wishlist.some((p) => p.id === selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        allProducts={PRODUCTS}
        onSelectProduct={setSelectedProduct}
      />

      {/* Personalized AI Stylist Modal */}
      <PersonalizedStylistModal
        isOpen={isStylistOpen}
        onClose={() => setIsStylistOpen(false)}
        products={PRODUCTS}
        onSelectProduct={setSelectedProduct}
        onAddToCart={handleAddToCart}
        onApplyCapsuleFilter={(catSlug) => {
          setSelectedCategory(catSlug);
          const el = document.getElementById("collection-catalog-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={handleRemovePromo}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlist}
        onRemoveWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onSelectProduct={setSelectedProduct}
      />

      {/* Seamless Checkout Modal */}
      <SeamlessCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        appliedPromo={appliedPromo}
        onOrderCompleted={(order) => {
          showToast(`Order #${order.orderId} Authorized! Tracking: ${order.trackingNumber}`);
        }}
        onClearCart={handleClearCart}
      />
    </div>
  );
}

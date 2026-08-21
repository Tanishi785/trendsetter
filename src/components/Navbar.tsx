import React, { useState } from "react";
import {
  ShoppingBag,
  Heart,
  Search,
  Sparkles,
  Menu,
  X,
  SlidersHorizontal,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Product } from "../types";

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenStylist: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  products: Product[];
  onSelectProduct: (p: Product) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenStylist,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  products,
  onSelectProduct,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "All Collections", value: "all" },
    { label: "Streetwear", value: "streetwear" },
    { label: "Minimalist", value: "minimalist" },
    { label: "Haute Evening", value: "evening" },
    { label: "Workwear", value: "workwear" },
    { label: "Casual Luxe", value: "casual-luxe" },
    { label: "Resort & Linen", value: "resort" },
    { label: "Outerwear", value: "outerwear" },
    { label: "Athleisure", value: "athleisure" },
  ];

  const searchResults = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 4)
    : [];

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/95 backdrop-blur-md text-white border-b border-neutral-800/80 transition-all">
      {/* Top editorial ticker */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border-b border-neutral-800/50 py-1.5 px-4 text-center text-xs tracking-wider text-neutral-300 flex items-center justify-center gap-3">
        <span className="inline-flex items-center gap-1.5 text-amber-300 font-medium">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          SPRING / SUMMER &apos;26 ATELIER DROP
        </span>
        <span className="hidden md:inline text-neutral-500">•</span>
        <span className="hidden md:inline text-neutral-400">
          Complimentary Worldwide Express on orders over $150
        </span>
        <span className="hidden lg:inline text-neutral-500">•</span>
        <button
          onClick={onOpenStylist}
          className="underline hover:text-amber-200 transition-colors ml-1 inline-flex items-center gap-1 font-medium"
        >
          Try AI Stylist
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Mobile Menu Button */}
        <button
          id="mobile-menu-toggle-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-neutral-300 hover:text-white rounded-lg hover:bg-neutral-800/50 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Brand Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onSelectCategory("all")}>
          <div className="w-7 h-7 rounded-sm bg-white text-black flex items-center justify-center font-bold tracking-tighter text-sm shadow-md">
            TS
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-widest uppercase font-serif">
              trendsetter
            </span>
            <span className="text-[9px] tracking-[0.25em] text-neutral-400 -mt-1 uppercase">
              Contemporary Atelier
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = selectedCategory === link.value;
            return (
              <button
                key={link.value}
                id={`nav-link-${link.value}`}
                onClick={() => onSelectCategory(link.value)}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-white text-neutral-950 font-semibold shadow-sm"
                    : "text-neutral-300 hover:text-white hover:bg-neutral-800/60"
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Stylist Button */}
          <button
            id="ai-stylist-nav-btn"
            onClick={onOpenStylist}
            className="group relative inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-neutral-950 hover:shadow-lg hover:shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-200"
          >
            <Sparkles className="w-3.5 h-3.5 fill-neutral-950 animate-spin text-neutral-950" style={{ animationDuration: "8s" }} />
            <span className="hidden sm:inline">AI Stylist</span>
            <span className="sm:hidden">Stylist</span>
          </button>

          {/* Search Toggle */}
          <button
            id="search-toggle-btn"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 text-neutral-300 hover:text-white rounded-full hover:bg-neutral-800/60 transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist */}
          <button
            id="wishlist-toggle-btn"
            onClick={onOpenWishlist}
            className="relative p-2 text-neutral-300 hover:text-white rounded-full hover:bg-neutral-800/60 transition-colors"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in-50 duration-200">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart / Bag */}
          <button
            id="cart-toggle-btn"
            onClick={onOpenCart}
            className="relative p-2 text-neutral-300 hover:text-white rounded-full hover:bg-neutral-800/60 transition-colors flex items-center gap-1.5"
            aria-label="Shopping Bag"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-amber-400 text-neutral-950 text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden xl:inline text-xs font-semibold tracking-wider uppercase text-neutral-300">
              Bag
            </span>
          </button>
        </div>
      </div>

      {/* Expandable Interactive Search Bar */}
      {isSearchOpen && (
        <div className="border-t border-neutral-800 bg-neutral-900/98 px-4 py-4 sm:px-8 transition-all animate-in fade-in-20 slide-in-from-top-2 duration-200">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-neutral-400" />
              <input
                id="main-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search styles, fabrics, silk gowns, trenches, streetwear..."
                className="w-full bg-neutral-950 border border-neutral-700 rounded-full pl-12 pr-12 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-4 text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick tags */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-neutral-400">
              <span className="text-neutral-500">Popular:</span>
              {["Wool Trench", "Mulberry Silk", "French Terry", "Wide Trousers", "Linen Resort", "Smoking Blazer"].map(
                (term) => (
                  <button
                    key={term}
                    onClick={() => onSearchChange(term)}
                    className="px-2.5 py-1 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 transition-colors"
                  >
                    {term}
                  </button>
                )
              )}
            </div>

            {/* Live Search Suggestions Dropdown */}
            {searchResults.length > 0 && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-neutral-800">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectProduct(item);
                      setIsSearchOpen(false);
                    }}
                    className="flex items-center gap-3 p-2 rounded-lg bg-neutral-950/60 hover:bg-neutral-800/80 cursor-pointer border border-neutral-800/50 transition-colors"
                  >
                    <img
                      src={item.images.main}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-14 object-cover rounded bg-neutral-800 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-semibold text-white truncate">{item.name}</h4>
                      <p className="text-[11px] text-neutral-400 truncate">{item.categoryLabel}</p>
                      <p className="text-xs font-bold text-amber-300 mt-0.5">${item.price}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-500 mr-1" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-800 bg-neutral-950 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="mb-3 px-2">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest">
              Collections
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.value}
                onClick={() => {
                  onSelectCategory(link.value);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors ${
                  selectedCategory === link.value
                    ? "bg-white text-neutral-950 font-bold"
                    : "text-neutral-300 hover:bg-neutral-900"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-neutral-800 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenStylist();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              Launch AI Personal Stylist
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

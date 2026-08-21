import React, { useState } from "react";
import {
  Sparkles,
  X,
  ArrowRight,
  Check,
  ShoppingBag,
  SlidersHorizontal,
  Compass,
  Palette,
  Layers,
  Calendar,
  Zap,
  Tag,
} from "lucide-react";
import { Product, StylistRecommendation, ProductColor } from "../types";

interface PersonalizedStylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (p: Product) => void;
  onAddToCart: (product: Product, color: ProductColor, size: string, quantity: number) => void;
  onApplyCapsuleFilter: (categorySlug: string) => void;
}

export const PersonalizedStylistModal: React.FC<PersonalizedStylistModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onAddToCart,
  onApplyCapsuleFilter,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<number>(1);
  const [gender, setGender] = useState<string>("all");
  const [aesthetic, setAesthetic] = useState<string>("Quiet Luxury Minimalist");
  const [occasion, setOccasion] = useState<string>("Weekend Social & Dining");
  const [fitPreference, setFitPreference] = useState<string>("Relaxed Tailored");
  const [palette, setPalette] = useState<string>("Monochrome & Warm Earth");
  const [customGoal, setCustomGoal] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<StylistRecommendation | null>(null);

  const aestheticOptions = [
    {
      id: "minimalist",
      title: "Quiet Luxury Minimalist",
      desc: "Clean lines, heavy Italian wool, and architectural fluid breaks.",
      icon: Layers,
    },
    {
      id: "streetwear",
      title: "Neo-Tokyo Streetwear",
      desc: "520GSM French terry, tactical ripstop overshirts & modular drape.",
      icon: Zap,
    },
    {
      id: "evening",
      title: "Haute Evening Glamour",
      desc: "Liquid mulberry silk charmeuse and midnight crushed velvet.",
      icon: Sparkles,
    },
    {
      id: "resort",
      title: "French Riviera Resort",
      desc: "Crushed Normandy linen, sun-bleached ecru, and relaxed camp collars.",
      icon: Compass,
    },
  ];

  const occasionOptions = [
    "Gallery Opening & Rooftop Dinner",
    "Executive & Creative Workplace",
    "Metropolitan Weekend Social",
    "Luxury Travel & Airport Transit",
    "Black Tie Gala & Red Carpet",
  ];

  const fitOptions = [
    "Oversized & Dropped Shoulders",
    "Sculpted & Structured Tailoring",
    "Fluid Floor-Sweeping Drape",
    "Second-Skin Contoured Knit",
  ];

  const paletteOptions = [
    { name: "Monochrome & Obsidian", colors: ["#111111", "#F4F1EA", "#7A8288"] },
    { name: "Warm Earth & Terracotta", colors: ["#C4623C", "#C19A6B", "#EFEBD9"] },
    { name: "Midnight Jewel Tones", colors: ["#0C2340", "#103C2E", "#1A1A1A"] },
    { name: "Soft Cashmere Pastels", colors: ["#D9D2C7", "#E8D8C8", "#8F9779"] },
  ];

  const handleGenerateRecommendation = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stylist/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gender,
          aesthetic,
          occasion,
          fitPreference,
          palette,
          userGoal: customGoal,
        }),
      });
      const data = await res.json();
      if (data.success && data.recommendation) {
        setRecommendation(data.recommendation);
        setStep(3); // Result stage
      } else {
        throw new Error("Stylist fallback triggered");
      }
    } catch (e) {
      // Fallback presentation
      setRecommendation({
        headline: "Monochrome Precision: The Architectural Capsule",
        editorialSummary: "Subtle elegance defined by crisp tailoring, fluid drape, and uncompromised Italian cotton blends that transition effortlessly from gallery openings to private dinners.",
        keyPieces: ["Atelier Sculpted Trench Coat", "Fluid Pleated Trousers", "Pure Cashmere Mockneck"],
        proStylingTip: "Pair high-waisted fluid trousers with a fitted structured mockneck to create a statuesque vertical line. Keep hardware muted matte silver.",
        colorMoodDescription: "A sophisticated harmony of bone white, graphite, and washed taupe that elevates every movement.",
        curatedTag: "minimalist",
      });
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  // Find matching products
  const matchingCategorySlug = recommendation?.curatedTag || "minimalist";
  const matchedProducts = products.filter(
    (p) => p.category === matchingCategorySlug || p.tags.some((t) => t.toLowerCase().includes(matchingCategorySlug))
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        id="ai-stylist-modal"
        className="relative w-full max-w-4xl bg-neutral-950 text-white rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl flex flex-col my-auto max-h-[92vh]"
      >
        {/* Header Bar */}
        <div className="p-6 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-neutral-950 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold uppercase font-serif tracking-wider text-white">
                Trendsetter AI Personal Stylist
              </h2>
              <p className="text-xs text-neutral-400">
                Bespoke capsule curation powered by intelligent runway styling directors
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* STEP 1: Aesthetic & Occasion */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-amber-400 mb-1">
                  Step 1 of 2: Define Your Vibe & Occasion
                </h3>
                <p className="text-xs text-neutral-400">
                  Select your primary fashion aesthetic to curate appropriate silhouettes.
                </p>
              </div>

              {/* Aesthetic Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {aestheticOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = aesthetic === opt.title;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setAesthetic(opt.title)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-neutral-900 border-amber-400 ring-1 ring-amber-400"
                          : "bg-neutral-950 hover:bg-neutral-900/60 border-neutral-800"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${isSelected ? "text-amber-400" : "text-neutral-400"}`} />
                          <h4 className="text-sm font-bold text-white">{opt.title}</h4>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                      </div>
                      <p className="text-xs text-neutral-400">{opt.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Occasion Selection */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block mb-2">
                  Primary Occasion / Setting
                </label>
                <div className="flex flex-wrap gap-2">
                  {occasionOptions.map((occ) => (
                    <button
                      key={occ}
                      onClick={() => setOccasion(occ)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                        occasion === occ
                          ? "bg-white text-neutral-950 font-bold shadow-md"
                          : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800"
                      }`}
                    >
                      {occ}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg"
                >
                  <span>Next: Proportions & Color</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Fit, Color & Custom Notes */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-amber-400 mb-1">
                  Step 2 of 2: Proportions & Color Mood
                </h3>
                <p className="text-xs text-neutral-400">
                  Tailor your silhouette and colorway preferences.
                </p>
              </div>

              {/* Fit Preferences */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block mb-2">
                  Silhouette Preference
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {fitOptions.map((fit) => (
                    <button
                      key={fit}
                      onClick={() => setFitPreference(fit)}
                      className={`p-3 rounded-xl text-xs text-left font-medium border transition-all ${
                        fitPreference === fit
                          ? "bg-neutral-900 border-amber-400 text-white font-bold"
                          : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
                      }`}
                    >
                      {fit}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Palette */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block mb-2">
                  Preferred Color Harmony
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {paletteOptions.map((pal) => (
                    <div
                      key={pal.name}
                      onClick={() => setPalette(pal.name)}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between ${
                        palette === pal.name
                          ? "bg-neutral-900 border-amber-400"
                          : "bg-neutral-950 border-neutral-800"
                      }`}
                    >
                      <span className="text-xs text-neutral-200 font-medium">{pal.name}</span>
                      <div className="flex items-center gap-1">
                        {pal.colors.map((c, i) => (
                          <span
                            key={i}
                            className="w-3 h-3 rounded-full border border-neutral-700"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Goal Input */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block mb-1">
                  Specific Style Goal or Trip (Optional)
                </label>
                <input
                  type="text"
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  placeholder="e.g. 'Effortless quiet luxury pieces for an architectural summit in Copenhagen'"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-medium text-neutral-400 hover:text-white"
                >
                  Back
                </button>
                <button
                  onClick={handleGenerateRecommendation}
                  disabled={loading}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-neutral-950 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Styling Your Capsule...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Curate My Look</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Tailored Capsule Result */}
          {step === 3 && recommendation && (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              {/* Editorial Capsule Box */}
              <div className="p-6 rounded-3xl bg-neutral-900 border border-amber-400/50 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Sparkles className="w-32 h-32 text-amber-400" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-widest mb-3">
                  <Sparkles className="w-3 h-3" />
                  <span>Curated Atelier Capsule • 98% Match</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black uppercase font-serif text-white">
                  {recommendation.headline}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mt-2 font-light">
                  {recommendation.editorialSummary}
                </p>

                {/* Pro Styling Tip Callout */}
                <div className="mt-4 p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-xs">
                  <p className="text-amber-400 font-bold uppercase tracking-wider text-[10px] mb-1">
                    Director Styling Secret:
                  </p>
                  <p className="text-neutral-300 leading-relaxed">{recommendation.proStylingTip}</p>
                </div>
              </div>

              {/* Recommended Garments in Store */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-300">
                    Recommended Capsule Pieces:
                  </h4>
                  <button
                    onClick={() => {
                      onApplyCapsuleFilter(recommendation.curatedTag);
                      onClose();
                    }}
                    className="text-xs text-amber-400 hover:underline inline-flex items-center gap-1 font-semibold"
                  >
                    <span>View All Matching Styles</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {matchedProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onSelectProduct(p);
                        onClose();
                      }}
                      className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-amber-400/80 cursor-pointer transition-all group"
                    >
                      <div className="aspect-[3/4] rounded-xl overflow-hidden bg-neutral-950 mb-2 relative">
                        <img
                          src={p.images.main}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-amber-300 font-bold">
                          98% Match
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-white truncate font-serif">{p.name}</h5>
                      <p className="text-[11px] text-neutral-400 truncate">{p.categoryLabel}</p>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-xs font-black text-amber-400">${p.price}</span>
                        <span className="text-[10px] text-neutral-400 group-hover:text-white uppercase font-bold">
                          View Outfit →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-neutral-400 hover:text-white font-medium"
                >
                  Adjust Style Preferences
                </button>
                <button
                  onClick={() => {
                    onApplyCapsuleFilter(recommendation.curatedTag);
                    onClose();
                  }}
                  className="px-6 py-3 rounded-full bg-white text-neutral-950 hover:bg-neutral-200 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop Curated Collection</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

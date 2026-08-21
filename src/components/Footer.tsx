import React, { useState } from "react";
import { Sparkles, ArrowRight, Check, ShieldCheck, Mail, MapPin } from "lucide-react";

interface FooterProps {
  onOpenStylist: () => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenStylist, onSelectCategory }) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="w-full bg-neutral-950 text-white border-t border-neutral-800">
      {/* Newsletter VIP Club Banner */}
      <div className="border-b border-neutral-800/80 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Privé Atelier Access</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase font-serif text-white">
              Receive $20 Off Your First Look
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Join the Trendsetter journal for early private runway drop alerts, personalized capsule style invites, and fabric provenance updates.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubscribe} className="w-full max-w-md flex gap-2">
            {subscribed ? (
              <div className="w-full py-3.5 px-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-emerald-400 text-xs font-bold flex items-center justify-center gap-2">
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Welcome to Trendsetter Privé! Check your email for your $20 code.</span>
              </div>
            ) : (
              <>
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your VIP email..."
                    required
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-white text-neutral-950 hover:bg-amber-300 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
                >
                  Join
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">
        {/* Col 1: Brand Info */}
        <div className="col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-white text-black flex items-center justify-center font-bold text-xs">
              TS
            </div>
            <span className="text-xl font-black uppercase font-serif tracking-widest text-white">
              trendsetter
            </span>
          </div>
          <p className="text-neutral-400 text-xs leading-relaxed max-w-sm font-light">
            A contemporary haute-streetwear atelier redefining luxury through architectural silhouettes, certified ethical natural fibers, and bespoke AI style direction.
          </p>
          <div className="flex items-center gap-4 text-neutral-400 text-xs pt-2">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              New York • Paris • Tokyo • Milan
            </span>
          </div>
        </div>

        {/* Col 2: Collections */}
        <div className="space-y-3">
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
            Fashion Capsules
          </h4>
          <ul className="space-y-2 text-neutral-400">
            {["streetwear", "minimalist", "evening", "workwear", "resort", "outerwear"].map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => onSelectCategory(cat)}
                  className="hover:text-white capitalize transition-colors"
                >
                  {cat.replace("-", " ")}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Client Services */}
        <div className="space-y-3">
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
            Client Services
          </h4>
          <ul className="space-y-2 text-neutral-400">
            <li>
              <button onClick={onOpenStylist} className="text-amber-400 hover:underline">
                AI Personal Stylist
              </button>
            </li>
            <li>
              <span className="hover:text-white cursor-pointer">Complimentary Hemming</span>
            </li>
            <li>
              <span className="hover:text-white cursor-pointer">Global Express Shipping</span>
            </li>
            <li>
              <span className="hover:text-white cursor-pointer">30-Day Easy Returns</span>
            </li>
            <li>
              <span className="hover:text-white cursor-pointer">Garment Care & Longevity</span>
            </li>
          </ul>
        </div>

        {/* Col 4: Sustainability & Atelier */}
        <div className="space-y-3">
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
            Atelier Standards
          </h4>
          <ul className="space-y-2 text-neutral-400">
            <li>
              <span className="hover:text-white cursor-pointer">Grade-6A Mulberry Silk</span>
            </li>
            <li>
              <span className="hover:text-white cursor-pointer">100% Certified French Flax</span>
            </li>
            <li>
              <span className="hover:text-white cursor-pointer">520GSM Japanese Loopback</span>
            </li>
            <li>
              <span className="hover:text-white cursor-pointer">Carbon-Neutral Logistics</span>
            </li>
            <li>
              <span className="hover:text-white cursor-pointer">Audited Artisan Ateliers</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-850 py-6 px-4 sm:px-6 lg:px-8 bg-neutral-950 text-neutral-500 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Trendsetter Atelier Inc. All rights reserved. Registered Trademark.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-neutral-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-neutral-300 cursor-pointer">Terms of Luxury Service</span>
            <span className="hover:text-neutral-300 cursor-pointer">Cookie Preferences</span>
            <span className="hover:text-neutral-300 cursor-pointer">Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

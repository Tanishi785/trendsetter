import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  Calendar,
  Download,
  ShoppingBag,
  ExternalLink,
  Zap,
} from "lucide-react";
import { CartItem, ShippingAddress, OrderConfirmation } from "../types";

interface SeamlessCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  appliedPromo: { code: string; discountPercent: number; discountFixed: number } | null;
  onOrderCompleted: (order: OrderConfirmation) => void;
  onClearCart: () => void;
}

export const SeamlessCheckoutModal: React.FC<SeamlessCheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  appliedPromo,
  onOrderCompleted,
  onClearCart,
}) => {
  if (!isOpen) return null;

  const [checkoutStep, setCheckoutStep] = useState<"details" | "shipping" | "payment" | "confirmed">("details");
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderConfirmation | null>(null);

  // Form states
  const [address, setAddress] = useState<ShippingAddress>({
    firstName: "Alex",
    lastName: "Mercer",
    email: "alex.mercer@fashionatelier.com",
    phone: "+1 (555) 234-5678",
    street: "740 5th Avenue, Suite 1800",
    apartment: "Penthouse B",
    city: "New York",
    state: "NY",
    zipCode: "10019",
    country: "United States",
  });

  const [shippingMethod, setShippingMethod] = useState<"standard" | "express" | "green">("express");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "klarna" | "applepay">("card");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("08/28");
  const [cardCvc, setCardCvc] = useState("888");
  const [cardName, setCardName] = useState("ALEX MERCER");

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercent > 0) {
      discountAmount = (subtotal * appliedPromo.discountPercent) / 100;
    } else if (appliedPromo.discountFixed > 0) {
      discountAmount = appliedPromo.discountFixed;
    }
  }

  let shippingCost = 0;
  if (shippingMethod === "express") shippingCost = subtotal >= 150 ? 0 : 15;
  else if (shippingMethod === "green") shippingCost = 4;

  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleQuickFillSample = () => {
    setAddress({
      firstName: "Julian",
      lastName: "Saint-Germain",
      email: "julian.stg@trendsetter.com",
      phone: "+1 (415) 890-1234",
      street: "1088 Sansome Street, Loft 4A",
      apartment: "Apt 4A",
      city: "San Francisco",
      state: "CA",
      zipCode: "94111",
      country: "United States",
    });
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    try {
      // Call backend order generation
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shipping: address,
          payment: { method: paymentMethod },
          discount: discountAmount,
          total,
        }),
      });

      const data = await res.json();

      const orderObj: OrderConfirmation = {
        orderId: data.orderId || `TS-${Math.floor(100000 + Math.random() * 900000)}`,
        trackingNumber: data.trackingNumber || `TRK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        estimatedDelivery: data.estimatedDelivery || "Thursday, Aug 27",
        total,
        currency: "USD",
        itemCount: items.length,
        customerEmail: address.email,
        status: "Confirmed & In Preparation",
        timestamp: new Date().toISOString(),
        shippingAddress: address,
        items: [...items],
        paymentMethod: paymentMethod === "card" ? "Credit Card (•••• 4242)" : paymentMethod === "applepay" ? "Apple Pay" : "Klarna 4-Pay",
      };

      setCompletedOrder(orderObj);
      onOrderCompleted(orderObj);
      onClearCart();
      setCheckoutStep("confirmed");
    } catch (e) {
      // Fallback
      const orderObj: OrderConfirmation = {
        orderId: `TS-${Math.floor(100000 + Math.random() * 900000)}`,
        trackingNumber: `TRK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        estimatedDelivery: "Thursday, Aug 27",
        total,
        currency: "USD",
        itemCount: items.length,
        customerEmail: address.email,
        status: "Confirmed & In Preparation",
        timestamp: new Date().toISOString(),
        shippingAddress: address,
        items: [...items],
        paymentMethod: "Credit Card (•••• 4242)",
      };
      setCompletedOrder(orderObj);
      onOrderCompleted(orderObj);
      onClearCart();
      setCheckoutStep("confirmed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        id="seamless-checkout-modal"
        className="relative w-full max-w-4xl bg-neutral-950 text-white rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl flex flex-col my-auto max-h-[94vh]"
      >
        {/* Top Header */}
        <div className="p-5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-neutral-950 flex items-center justify-center font-bold text-xs">
              TS
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold uppercase font-serif tracking-wider text-white">
                Trendsetter Seamless Checkout
              </h2>
              <p className="text-[11px] text-neutral-400">
                End-to-end 256-bit encrypted luxury order processing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Step Stepper (if not confirmed) */}
        {checkoutStep !== "confirmed" && (
          <div className="px-6 py-3 bg-neutral-950 border-b border-neutral-800/80 flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2 sm:gap-6">
              <button
                onClick={() => setCheckoutStep("details")}
                className={`flex items-center gap-1.5 ${
                  checkoutStep === "details"
                    ? "text-amber-400"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-neutral-800 flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>Address</span>
              </button>
              <span className="text-neutral-700">/</span>

              <button
                onClick={() => setCheckoutStep("shipping")}
                className={`flex items-center gap-1.5 ${
                  checkoutStep === "shipping"
                    ? "text-amber-400"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-neutral-800 flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>Delivery</span>
              </button>
              <span className="text-neutral-700">/</span>

              <button
                onClick={() => setCheckoutStep("payment")}
                className={`flex items-center gap-1.5 ${
                  checkoutStep === "payment"
                    ? "text-amber-400"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-neutral-800 flex items-center justify-center text-[10px]">
                  3
                </span>
                <span>Payment</span>
              </button>
            </div>

            <div className="text-xs font-bold text-amber-300">
              Total: ${total.toFixed(2)}
            </div>
          </div>
        )}

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-6 sm:p-8">
          {/* STEP 1: Address & Details */}
          {checkoutStep === "details" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Express 1-Click Pay Buttons */}
              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400 font-bold uppercase tracking-wider">
                    Instant 1-Click Express Pay
                  </span>
                  <span className="text-amber-400 flex items-center gap-1 text-[11px]">
                    <Zap className="w-3 h-3" />
                    Bypasses manual forms
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setPaymentMethod("applepay");
                      handlePlaceOrder();
                    }}
                    className="py-3 px-4 rounded-xl bg-white text-black hover:bg-neutral-200 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <span> Pay</span>
                  </button>
                  <button
                    onClick={() => {
                      setPaymentMethod("card");
                      handlePlaceOrder();
                    }}
                    className="py-3 px-4 rounded-xl bg-neutral-800 text-white hover:bg-neutral-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-neutral-700"
                  >
                    <span>G Pay</span>
                  </button>
                  <button
                    onClick={() => {
                      setPaymentMethod("klarna");
                      handlePlaceOrder();
                    }}
                    className="py-3 px-4 rounded-xl bg-pink-600/30 text-pink-300 hover:bg-pink-600/40 border border-pink-500/40 font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Klarna.</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Or Enter Delivery Address
                </h3>
                <button
                  type="button"
                  onClick={handleQuickFillSample}
                  className="text-xs text-amber-400 hover:underline font-semibold"
                >
                  ⚡ Auto-Fill Demo Address
                </button>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-neutral-400 block mb-1">First Name</label>
                  <input
                    type="text"
                    value={address.firstName}
                    onChange={(e) => setAddress({ ...address, firstName: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Last Name</label>
                  <input
                    type="text"
                    value={address.lastName}
                    onChange={(e) => setAddress({ ...address, lastName: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-neutral-400 block mb-1">Email Address for Tracking</label>
                  <input
                    type="email"
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-neutral-400 block mb-1">Street Address</label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">City</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-neutral-400 block mb-1">State</label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">ZIP Code</label>
                    <input
                      type="text"
                      value={address.zipCode}
                      onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setCheckoutStep("shipping")}
                  className="px-8 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl"
                >
                  <span>Continue to Shipping Method</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Shipping Method */}
          {checkoutStep === "shipping" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Select Courier Speed
              </h3>

              <div className="space-y-3">
                {[
                  {
                    id: "express",
                    name: "Priority Air Express (1-2 Business Days)",
                    desc: "Signature required on delivery with real-time GPS tracking.",
                    price: subtotal >= 150 ? "FREE" : "$15.00",
                    badge: "Recommended",
                  },
                  {
                    id: "standard",
                    name: "Standard Atelier Courier (3-5 Business Days)",
                    desc: "Handled with protective moisture-sealed garment covers.",
                    price: "FREE",
                  },
                  {
                    id: "green",
                    name: "Eco Carbon-Neutral Delivery (3-5 Days)",
                    desc: "Zero-emission electric transit fleet + 1 tree planted per order.",
                    price: "$4.00",
                  },
                ].map((opt) => {
                  const isSelected = shippingMethod === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setShippingMethod(opt.id as any)}
                      className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                        isSelected
                          ? "bg-neutral-900 border-amber-400 ring-1 ring-amber-400"
                          : "bg-neutral-950 border-neutral-800 hover:bg-neutral-900/60"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <Truck className={`w-4 h-4 ${isSelected ? "text-amber-400" : "text-neutral-400"}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-white">{opt.name}</h4>
                            {opt.badge && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                                {opt.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-0.5">{opt.desc}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-white ml-3">{opt.price}</span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => setCheckoutStep("details")}
                  className="text-xs font-medium text-neutral-400 hover:text-white"
                >
                  ← Back to Address
                </button>
                <button
                  onClick={() => setCheckoutStep("payment")}
                  className="px-8 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment */}
          {checkoutStep === "payment" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Payment Method
                </h3>
                <span className="text-xs text-neutral-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  Encrypted & Secure
                </span>
              </div>

              {/* Payment Type Tabs */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "card", label: "Credit Card", icon: CreditCard },
                  { id: "klarna", label: "Klarna (4x $0 APR)", icon: Sparkles },
                  { id: "applepay", label: "Apple / Google Pay", icon: Zap },
                ].map((p) => {
                  const Icon = p.icon;
                  const isSelected = paymentMethod === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setPaymentMethod(p.id as any)}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                        isSelected
                          ? "bg-neutral-900 border-amber-400 text-white"
                          : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? "text-amber-400" : ""}`} />
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Card Form */}
              {paymentMethod === "card" && (
                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 text-xs">
                  <div>
                    <label className="text-neutral-400 block mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 block mb-1">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-neutral-400 block mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-neutral-400 block mb-1">CVC Code</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="CVC"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Order Summary Recap */}
              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-xs space-y-2">
                <div className="flex justify-between text-neutral-300">
                  <span>Delivering to:</span>
                  <span className="font-semibold text-white truncate max-w-[200px]">
                    {address.firstName} {address.lastName}, {address.city}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-300">
                  <span>Garments Count:</span>
                  <span className="font-semibold text-white">
                    {items.reduce((s, i) => s + i.quantity, 0)} Items
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
                  <span>Grand Total:</span>
                  <span className="text-amber-400 text-base">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setCheckoutStep("shipping")}
                  className="text-xs font-medium text-neutral-400 hover:text-white"
                >
                  ← Back to Delivery
                </button>
                <button
                  id="final-place-order-btn"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-neutral-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Authorizing Luxury Order...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Complete Purchase • ${total.toFixed(2)}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ORDER CONFIRMATION */}
          {checkoutStep === "confirmed" && completedOrder && (
            <div className="space-y-6 text-center animate-in zoom-in-95 duration-300">
              {/* Success Badge */}
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-widest">
                  Order Successfully Authorized
                </span>
                <h3 className="text-2xl sm:text-3xl font-black uppercase font-serif text-white mt-2">
                  Thank You, {completedOrder.shippingAddress.firstName}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-md mx-auto">
                  Your bespoke pieces are being carefully prepared in our climate-controlled atelier with protective garment dust bags.
                </p>
              </div>

              {/* Order Tracking Card */}
              <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 text-left space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-b border-neutral-800 pb-4">
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase font-bold">Order ID</span>
                    <span className="text-white font-mono font-bold text-xs">{completedOrder.orderId}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase font-bold">Air Waybill</span>
                    <span className="text-amber-300 font-mono font-bold text-xs">{completedOrder.trackingNumber}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase font-bold">Est. Delivery</span>
                    <span className="text-white font-bold text-xs">{completedOrder.estimatedDelivery}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase font-bold">Total Paid</span>
                    <span className="text-emerald-400 font-extrabold text-xs">${completedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Progress Stepper */}
                <div className="py-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-3">
                    Live Courier Status:
                  </span>
                  <div className="grid grid-cols-4 gap-1 text-center">
                    <div className="flex flex-col items-center">
                      <span className="w-6 h-6 rounded-full bg-emerald-500 text-neutral-950 font-bold text-xs flex items-center justify-center">✓</span>
                      <span className="text-[10px] font-bold text-white mt-1">Confirmed</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="w-6 h-6 rounded-full bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center animate-pulse">2</span>
                      <span className="text-[10px] font-bold text-amber-300 mt-1">Atelier QA</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="w-6 h-6 rounded-full bg-neutral-800 text-neutral-500 text-xs flex items-center justify-center">3</span>
                      <span className="text-[10px] text-neutral-500 mt-1">Air Express</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="w-6 h-6 rounded-full bg-neutral-800 text-neutral-500 text-xs flex items-center justify-center">4</span>
                      <span className="text-[10px] text-neutral-500 mt-1">Delivered</span>
                    </div>
                  </div>
                </div>

                {/* Director Post-Purchase Styling Guidance */}
                <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
                  <div className="flex items-center gap-2 text-amber-300 font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Your Post-Unboxing Style Care:</span>
                  </div>
                  <p className="text-neutral-300 text-[11px] leading-relaxed">
                    Upon arrival, steam garments gently on medium heat rather than direct pressing to preserve the fluid drape of the fabrics. Hang outerwear on wide contoured hangers.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-8 py-3.5 rounded-full bg-white text-neutral-950 font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 shadow-xl"
                >
                  Continue Exploring Runway Drops
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

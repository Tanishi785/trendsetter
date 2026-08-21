export interface ModelStats {
  height: string;
  wearingSize: string;
  measurements?: string;
  fitNotes: string;
}

export interface ProductColor {
  name: string;
  hex: string;
  image: string;
}

export interface CustomerReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  fitFeedback: "Runs Small" | "True to Size" | "Runs Large";
  sizePurchased: string;
  height?: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: "streetwear" | "minimalist" | "evening" | "casual-luxe" | "workwear" | "resort" | "athleisure" | "outerwear";
  categoryLabel: string;
  gender: "women" | "men" | "unisex";
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  tags: string[];
  colors: ProductColor[];
  sizes: string[];
  stockCount: number;
  modelStats: ModelStats;
  images: {
    main: string;
    modelLook1: string;
    modelLook2: string;
    detail: string;
  };
  description: string;
  fabricDetails: string[];
  careInstructions: string[];
  stylingTips: string[];
  completeTheLookIds?: string[];
  matchScore?: number;
}

export interface CategoryInfo {
  id: string;
  slug: Product["category"];
  name: string;
  tagline: string;
  image: string;
  itemCount: number;
  featuredBadge?: string;
}

export interface CartItem {
  product: Product;
  selectedColor: ProductColor;
  selectedSize: string;
  quantity: number;
}

export interface StyleProfile {
  gender: "women" | "men" | "unisex" | "all";
  aesthetic: string;
  occasion: string;
  fitPreference: string;
  palette: string;
  budget: string;
  userGoal: string;
}

export interface StylistRecommendation {
  headline: string;
  editorialSummary: string;
  keyPieces: string[];
  proStylingTip: string;
  colorMoodDescription: string;
  curatedTag: Product["category"];
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderConfirmation {
  orderId: string;
  trackingNumber: string;
  estimatedDelivery: string;
  total: number;
  currency: string;
  itemCount: number;
  customerEmail: string;
  status: string;
  timestamp: string;
  shippingAddress: ShippingAddress;
  items: CartItem[];
  paymentMethod: string;
}

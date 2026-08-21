import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI lazily/safely
let genAI: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAI;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "trendsetter", timestamp: new Date().toISOString() });
});

// Personalized Style Recommendation API
app.post("/api/stylist/recommend", async (req, res) => {
  try {
    const { occasion, aesthetic, fitPreference, palette, gender, budget, userGoal } = req.body;

    const ai = getGenAI();
    if (ai) {
      const prompt = `You are the lead Haute Couture & Streetwear Style Director at 'trendsetter', a high-end contemporary fashion boutique.
A client has requested a personalized style recommendation with the following profile:
- Aesthetic / Vibe: ${aesthetic || "Contemporary Minimalist Luxe"}
- Occasion / Event: ${occasion || "Everyday Elevated & Weekend Social"}
- Fit Preference: ${fitPreference || "Relaxed Structured"}
- Color Palette: ${palette || "Neutral Earth Tones with Statement Accents"}
- Gender / Styling Focus: ${gender || "Versatile / Contemporary"}
- Goal: ${userGoal || "Looking effortlessly chic and confident"}
- Budget Tier: ${budget || "Contemporary Luxe"}

Provide a tailored, high-fashion styling guide in JSON format with:
1. "headline": A punchy 5-8 word editorial capsule title (e.g. "Sculptural Minimalism: The Urban Solitude Capsule").
2. "editorialSummary": A 2-sentence sophisticated stylist note explaining the mood, silhouettes, and fabric interplay.
3. "keyPieces": An array of 3-4 recommended garment types to look for (e.g., ["Double-breasted Wool Blend Blazer", "Fluid Pleated Trousers", "Square-toe Leather Boots"]).
4. "proStylingTip": A tangible styling trick (e.g., "Tuck the front hem asymmetrically and layer fine gold chains to balance the oversized shoulders").
5. "colorMoodDescription": Explanation of why the chosen palette works for this silhouette.
6. "curatedTag": A single tag keyword to match store collections (one of: 'streetwear', 'minimalist', 'evening', 'casual-luxe', 'workwear', 'resort', 'athleisure', 'outerwear').

Respond ONLY with valid JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText);
        return res.json({ success: true, recommendation: parsed });
      }
    }

    // Fallback dynamic high-quality stylist curation if API key is not present
    const fallbackProfiles: Record<string, any> = {
      minimalist: {
        headline: "Monochrome Precision: The Architectural Capsule",
        editorialSummary: "Subtle elegance defined by crisp tailoring, fluid drape, and uncompromised Italian cotton blends that transition effortlessly from gallery openings to private dinners.",
        keyPieces: ["Oversized Relaxed Wool Trench", "Cashmere Blend Mockneck", "Wide-Leg Structured Trousers", "Minimalist Calfskin Mules"],
        proStylingTip: "Pair high-waisted fluid trousers with a fitted structured mockneck to create a statuesque vertical line. Keep hardware muted matte silver or brushed brass.",
        colorMoodDescription: "A sophisticated harmony of bone white, graphite, and washed taupe that elevates every movement.",
        curatedTag: "minimalist",
      },
      streetwear: {
        headline: "Neo-Tokyo Utility: Avant-Garde Urban Layering",
        editorialSummary: "Tactile tech-nylon combined with heavyweight French terry and heavy-soled accents for a silhouette that commands the metropolitan landscape.",
        keyPieces: ["Tactical Modular Bomber Jacket", "Heavyweight Acid-Wash Graphic Tee", "Multi-Pocket Cargo Pant", "Lugged Sole Combat Boots"],
        proStylingTip: "Layer the cropped utility jacket over an elongated inner layer to play with proportions and dynamic streetwear depth.",
        colorMoodDescription: "Midnight obsidian, concrete slate, and subtle volt neon accents for sharp industrial contrast.",
        curatedTag: "streetwear",
      },
      evening: {
        headline: "Midnight Radiance: Haute Evening Sophistication",
        editorialSummary: "Sculptural drape and lustrous silk-satin finishes tailored to catch ambient city lights with effortless grace.",
        keyPieces: ["Backless Satin Slip Gown / Tuxedo Jacket", "Fluid Silk Palazzo Pants", "Sculpted Metal Choker", "Strappy Stiletto Pumps"],
        proStylingTip: "Let a single structural statement accessory shine by keeping clean, unembellished necklines and minimalist makeup.",
        colorMoodDescription: "Deep onyx, champagne gold, and liquid obsidian creating an unforgettable evening silhouette.",
        curatedTag: "evening",
      },
    };

    const selectedFallback = fallbackProfiles[aesthetic?.toLowerCase()] || fallbackProfiles.minimalist;
    return res.json({ success: true, recommendation: selectedFallback });
  } catch (error: any) {
    console.error("Stylist API Error:", error);
    return res.status(500).json({
      success: false,
      error: "Unable to generate custom styling recommendation at this moment.",
    });
  }
});

// Checkout Order creation endpoint
app.post("/api/checkout/create-order", (req, res) => {
  try {
    const { items, shipping, payment, discount, total } = req.body;
    const orderId = `TS-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingNumber = `TRK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });

    res.json({
      success: true,
      orderId,
      trackingNumber,
      estimatedDelivery,
      total,
      currency: "USD",
      itemCount: items?.length || 0,
      customerEmail: shipping?.email || "customer@example.com",
      status: "Confirmed & In Preparation",
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`trendsetter server is running on http://localhost:${PORT}`);
  });
}

startServer();

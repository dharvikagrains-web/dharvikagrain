# Dharvika Grains™

> **"The Goodness of India's Harvest."**  
> *Nourishing a Better Tomorrow • Tradition • Purity • People • Planet*

A production-grade, editorial e-commerce platform for authentic **Chiru Dhanyalu** (unpolished traditional millets) and **pure cold-ground spices**, directly sourced from Indian dryland farmer clusters.

---

## 🌾 Brand Core & Philosophy

- **Authentic Chiru Dhanyalu**: Naturally unpolished Foxtail (Korralu), Little (Samalu), Kodo (Arikelu), Barnyard (Udalu), Finger Millet (Ragi), and White Sorghum (Jowar).
- **Cold-Ground Spices**: Low-temperature milling below 40°C to preserve volatile essential oils in Turmeric, Guntur Red Chilli, Coriander, Cumin, Malabar Black Pepper, and Deccan Masala.
- **Zero Fabrication**: Built with structured placeholders (`[ADD FSSAI LICENCE NUMBER]`, `[ADD BATCH LAB REPORT]`) for audit-ready compliance.
- **Visual Identity**: Warm Ivory (`#FAF7F2`), Deep Roasted Umber (`#241611`), Royal Forest Emerald (`#0D3522`), and Luxe Brushed Gold (`#C5A059`).

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) with React 19 & TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with natural Indian tone design tokens
- **Icons**: [Lucide React](https://lucide.dev/) + Custom scalable SVG brand icons
- **State Management**: React Context (`CartContext`, `WishlistContext`) with persistent `localStorage` synchronization
- **Typography**: Playfair Display (Serif) & Plus Jakarta Sans (Sans-serif) via `next/font`

---

## 📱 Complete Page Surface (20+ Routes)

| Category | Routes | Description |
|---|---|---|
| **Commerce** | `/`, `/shop`, `/products/[slug]` | Multi-faceted filtering (category, weight, price, in-stock), 5-way sorting, dynamic 500g/1kg pack selector, sticky mobile purchase bar |
| **Grains & Spices Hubs** | `/millets`, `/spices` | Educational grain matrix, cooking ratios, cold-milling aroma philosophy |
| **Culinary & Journal** | `/recipes`, `/recipes/[slug]`, `/journal`, `/journal/[slug]` | Traditional recipes with integrated "Shop Grain" CTAs, editorial essays on ancient grain culinary science |
| **Story & Traceability** | `/about`, `/sourcing`, `/quality` | Brand founding narrative, 5-step Farm-to-Home supply chain, mechanical cleaning & purity protocols |
| **Cart & Indian Checkout** | `/cart`, `/checkout`, `/order-success` | Cart drawer with dynamic free shipping progress bar, Indian address validation, payment abstraction (UPI, Cards, COD), 4-stage order tracker |
| **Customer Portal** | `/account` | Past orders, saved wishlist items, address records |
| **Compliance & Support** | `/contact`, `/faq`, `/privacy-policy`, `/terms`, `/shipping-policy`, `/refund-policy` | FSSAI transparency, return policies, contact desk, categorised accordion FAQ |
| **SEO Infrastructure** | `/sitemap.xml`, `/robots.txt` | Automated sitemap generator and search crawl directives |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.18+ or 20+
- npm / yarn / pnpm

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/dharvikagrains-web/dharvikagrain.git
cd dharvikagrain

# Install dependencies
npm install
```

### 3. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build
```bash
npm run build
npm run start
```

---

## ⚙️ Configuration

Centralized brand parameters can be customized in [`src/data/brandConfig.ts`](./src/data/brandConfig.ts):
- Brand name & tagline
- Support email & customer care details
- FSSAI registration & registered facility address
- Free shipping threshold (default: ₹500) and flat delivery fees

---

## 📄 License & Compliance

© 2026 Dharvika Grains™. All rights reserved. Packaged in certified food-grade facilities in India.

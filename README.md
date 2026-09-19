# Dharvika Grains™

> **"The Goodness of India's Harvest."**  
> *Nourishing a Better Tomorrow • Tradition • Purity • People • Planet*

A production-grade, full-scale D2C e-commerce platform and executive administration suite for authentic **Chiru Dhanyalu** (unpolished traditional millets) and **pure cold-ground spices**, directly sourced from rain-fed Indian farmer clusters.

GitHub Repository: [https://github.com/dharvikagrains-web/dharvikagrain](https://github.com/dharvikagrains-web/dharvikagrain)

---

## 🌾 Brand Core & Philosophy

- **Authentic Chiru Dhanyalu**: Naturally unpolished Foxtail (*Korralu*), Little (*Samalu*), Kodo (*Arikelu*), Barnyard (*Udalu*), Finger Millet (*Ragi*), and White Sorghum (*Jowar*).
- **Cold-Ground Spices**: Low-temperature milling below 40°C to preserve volatile essential oils in Lakadong Turmeric, Guntur Red Chilli, Kishangarh Coriander, Saurashtra Cumin, Tellicherry Black Pepper, and Deccan Masala.
- **Zero Fabrication**: Built with structured placeholders (`[ADD FSSAI LICENCE NUMBER]`, `[ADD BATCH LAB REPORT]`) for audit-ready compliance.
- **Visual Identity**: Warm Ivory (`#FAF7F2`), Deep Roasted Umber (`#241611`), Royal Forest Emerald (`#0D3522`), and Luxe Brushed Gold (`#C5A059`).

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) with React 19 & TypeScript
- **Styling**: Tailwind CSS with custom Indian tone design tokens
- **Icons**: [Lucide React](https://lucide.dev/) + Custom scalable SVG brand emblems
- **State Management**: React Context (`CartContext`, `WishlistContext`) with persistent `localStorage` synchronization
- **Typography**: Playfair Display (Serif) & Plus Jakarta Sans (Sans-serif) via `next/font`
- **Deployment**: Zero-config Vercel / Node.js production container readiness

---

## 📱 Complete Architecture Surface (56 Static Routes)

### 1. Storefront & Commerce
| Module | Route | Key Features |
|---|---|---|
| **Homepage** | `/` | Luxury embossed logo, 4 category cards (*Millets, Spices, Masalas, Combos*), quick *Shop by Grain / Shop by Spice* finder, verified reviews, social feed |
| **Shop All** | `/shop` | Category tabs, in-page search, dietary preferences, pack weight filters, price slider, and sorting |
| **Category Hubs** | `/millets`, `/spices` | Educational grain matrix, cooking ratios, cold-milling aroma philosophy |
| **Product Detail** | `/products/[slug]`, `/product/[slug]` | 24 verified reviews, star rating, pack weight pills, discount % badge, instant *Buy Now* flow, deep tabs (Cooking, Quality, Batch, Nutrition) |
| **Search Engine** | `/search` | Global autocomplete, popular searches, recent queries, typo-tolerant matching across grains, spices, and recipes |
| **Wishlist** | `/wishlist` | 1-click add-to-cart, remove item, guest login prompt, header badge counter |
| **Shopping Cart** | `/cart` | Dynamic free shipping meter (*"₹X more for FREE DELIVERY"*), coupon validation, move-to-wishlist, quantity steppers |
| **Checkout** | `/checkout` | 4-step streamlined flow: Contact → Saved Delivery Address (`Home` / `Work`) → Order Summary → Coupon Code |
| **Payment Gateway** | `/checkout/payment` | UPI (*Google Pay, PhonePe, Paytm, Dynamic QR*), Credit/Debit Cards, Net Banking, Wallets, Cash on Delivery (COD) |
| **Order Success** | `/order/success` | Order confirmed screen (`#DG10248`), estimated delivery window, instant *Track Order* link |
| **Authentication** | `/login`, `/signup` | +91 Mobile OTP verification with 24-second timer and Google SSO button |
| **Customer Hub** | `/account` | Active order spotlight, profile editor, navigation tiles |
| **Order Tracking** | `/account/orders/[id]` | 7-stage visual timeline (*Placed → Confirmed → Processing → Packed → Shipped → Out for Delivery → Delivered*), Delhivery/Blue Dart tracking |
| **Address Book** | `/account/addresses` | Saved addresses with Home/Work tags, add/edit modal with Indian address fields |
| **Coupons Hub** | `/account/coupons` | Active discount vouchers (`WELCOME10`, `FIRSTORDER`, `TRADITION10`, `FREESHIP`) with 1-click clipboard copy |
| **Customer Reviews** | `/account/reviews` | Verified purchase review form with 5-star selector and photo mock |
| **Floating Support** | Global | Persistent *Need Help?* widget with direct WhatsApp / phone dialer and quick resolution topics |

---

### 2. 👑 Executive Admin Suite (`/admin`)

Full back-office suite accessible at `/admin`:

- **Command Hub** (`/admin`): Executive metrics (Today's Sales ₹48,520, 126 Orders, AOV ₹339, 42 Active SKUs), recent orders table, low-stock threshold warnings.
- **Orders Management** (`/admin/orders`): Status filter tabs (*All, Processing, Packed, Shipped, Delivered*), search, pack and ship triggers.
- **Product Catalog** (`/admin/products`): SKU directory, weight variants, pricing, bestseller toggles, and *"Add New Provision"* modal.
- **Stock Control** (`/admin/inventory`): Real-time stock counts, 🟢 In Stock, 🟡 Low Stock, 🔴 Out of Stock status, inline adjusters (`-10` / `+25`).
- **Batches & Traceability** (`/admin/batches`): Farm lots (`DG-KOR-0926`), harvest dates, farmer clusters, moisture %, lab test reports.
- **Logistics & Dispatch** (`/admin/shipping`): Courier assignments (Delhivery / Blue Dart), AWB tracking, thermal label generation.
- **Returns & Refunds** (`/admin/returns`): Claim moderation, food-safety hygiene policy enforcement, UPI refund triggers.
- **Coupons & Campaigns** (`/admin/coupons`): Promotion code generator, discount %, usage tracking, active/inactive switches.
- **Reviews Moderation** (`/admin/reviews`): Customer feedback audit, verified purchase status, review approval/removal.
- **Analytics & GMV Reports** (`/admin/analytics`): Monthly revenue bar charts, category revenue share, top-selling provisions.
- **Customer Directory** (`/admin/customers`): Customer CRM with lifetime spend, order count, and loyalty segments.
- **Store Settings** (`/admin/settings`): Free delivery threshold (₹500), COD fee rules, FSSAI license compliance, warehouse address.

---

## 🚀 Getting Started

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/dharvikagrains-web/dharvikagrain.git
cd dharvikagrain

# Install dependencies
npm install
```

### 2. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) for the live storefront or [http://localhost:3000/admin](http://localhost:3000/admin) for the admin dashboard.

### 3. Production Build
```bash
npm run build
npm run start
```
The build compiles **56 static routes** with zero errors or runtime warnings.

---

## ☁️ Deployment to Vercel

1. Log in to [Vercel](https://vercel.com).
2. Click **Add New Project** and select `dharvikagrains-web/dharvikagrain` from your GitHub account.
3. Framework Preset will automatically detect **Next.js**.
4. Click **Deploy**. Vercel will build and launch your production site with automatic global edge caching and SSL.

---

## ⚙️ Configuration

Centralized brand and operational parameters are located in [`src/data/brandConfig.ts`](./src/data/brandConfig.ts):
- Brand name, tagline, and mission
- Support email & phone numbers
- FSSAI registration & registered facility address
- Free shipping threshold (default: ₹500) and flat delivery charges

---

## 📄 Compliance & Food Safety

© 2026 Dharvika Grains Private Limited. All rights reserved. Packaged in certified food-grade facilities in India adhering to FSSAI standards.

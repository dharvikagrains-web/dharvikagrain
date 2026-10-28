# DHARVIKA GRAINS — Comprehensive Codebase & UX Audit

**Date:** October 28, 2026  
**Auditor:** Senior Next.js + UX Engineer  
**Project:** Dharvika Grains (Hyderabad, Telangana) — Direct-to-Consumer Organic Millets & Cold-Ground Spices Storefront  

---

## 1. Technical Architecture & Framework Stack

| Layer | Technology & Version | Observations / Notes |
| :--- | :--- | :--- |
| **Framework** | Next.js `16.3.5` (App Router) | Utilizing React 19 Server Components and Client Components (`use client`). Turbopack / Webpack compatible. |
| **Runtime & Core** | React `19.2.8`, React DOM `19.2.8` | React 19 action support, `useSyncExternalStore` in client headers to avoid hydration mismatch. |
| **TypeScript** | TypeScript `^5` | Strict mode enabled, strict route params typing (`params: Promise<{ slug: string }>`). |
| **Styling System** | Tailwind CSS v4 (`@tailwindcss/postcss` ^4, `tailwindcss` ^4) | Configured via `@theme` in `src/app/globals.css`. Design tokens mapped to CSS variables. |
| **Database & ORM** | Prisma `^7.10.0` with `@prisma/adapter-pg` `^7.10.0` | Dual-mode: Local PostgreSQL container via Prisma adapter with in-memory test seams. |
| **Icons & Assets** | `lucide-react` `^1.47.0` | Lightweight SVG icons used across header, footer, product cards, and cart. |
| **Analytics** | Google Analytics 4 (`next/script`) | Privacy-first consent mode configured before initialization. |

---

## 2. Typography & Font Configuration

### Active Font Setup (`src/app/layout.tsx` & `src/app/globals.css`)
- **Editorial Headings**: `Cormorant_Garamond` (Google Fonts, weights 500, 600, 700, CSS variable `--font-cormorant`, fallback `Georgia, serif`).
- **Body & Controls**: `DM_Sans` (Google Fonts, weights 400, 500, 600, 700, CSS variable `--font-dmsans`, fallback `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`).
- **Data & Numbers**: `Inter` (weights 400, 500, 600, 700, CSS variable `--font-inter`, with OpenType features `"tnum" 1, "cv05" 1` for tabular alignment).
- **Telugu Cultural Glyphs**:
  - `Noto_Serif_Telugu` (subset `'telugu'`, weights 500, 600, variable `--font-telugu-serif`).
  - `Noto_Sans_Telugu` (subset `'telugu'`, weights 400, 500, 600, variable `--font-telugu-sans`).

### Typography Audit Findings
1. **Telugu Glyph Safety**: Telugu fonts are loaded via `next/font/google` with subset `'telugu'`, but certain components lack fallback stacks that ensure Telugu text renders smoothly without falling back to system sans.
2. **Tabular Numerals**: `.price-display` and `.font-data` have `font-feature-settings: "tnum" 1`, but several prices in cards and cart summaries use raw font classes without tabular alignment.
3. **Wordmark & Logo Spacing**: The wordmark in `Header.tsx` renders spaced text `G R A I N S` with `tracking-[0.24em]` rather than an inline SVG or dedicated vector lockup.

---

## 3. Product Catalog & Data Sources

### Primary Product Data (`src/data/products.ts`)
- **Total Products**: 15 SKUs cataloged.
  - **Chiru Dhanyalu (Millets)**: Korralu (Foxtail), Samalu (Little), Arikelu (Kodo), Udalu (Barnyard), Ragi (Finger), Jowar (Sorghum).
  - **Single-Origin Spices**: Salem Turmeric (Curcumin 4.8%), Guntur Teja Red Chilli, Whole Coriander Seeds, Unpolished Cumin Seeds, Deccan Garam Masala.
  - **Pantry Combos**: 3-Millet Staples Box, Royal Millet & Spice Kit, Immunity & Wellness Combo.
- **Missing Categories**:
  - The footer currently links to `/shop?category=oils` ("Wood-Pressed Oils"), but **zero products exist in the catalog for oils**. This leads to an empty search/shop state.

---

## 4. UI/UX & Consistency Audit

### Issue 1: Free Shipping Threshold Discrepancy
- **Header Top Ticker**: Complimentary shipping on orders above ₹500 (`brandConfig.freeShippingThreshold`).
- **Footer Trust Strip**: Displays "Complimentary Shipping > ₹500".
- **Cart Drawer & Cart Page**: References ₹500 threshold with dynamic progress calculation.
- **Hero Trust Strip (`src/app/page.tsx:227`)**: Discrepancy found: displays `"Free Delivery Above ₹999"`!
- **Resolution**: Create a single shared source of truth `SHIPPING_FREE_THRESHOLD = 500` in a config module and reference it everywhere.

### Issue 2: Metadata & SEO Deficiencies
- `og:url`, `og:image`, and `twitter:image` currently have hardcoded defaults pointing to `dharvikagrains.in`.
- Metadata needs to derive dynamically from `process.env.NEXT_PUBLIC_SITE_URL` via `metadataBase`.
- Missing `themeColor` in viewport definition (Next.js 15/16 format).
- Canonical URL generation and per-page OpenGraph metadata are missing on several secondary pages.

### Issue 3: Navigation & Action Tap Targets
- Desktop action buttons in `Header.tsx` use `p-2` (~36px), which is below the WCAG/Lighthouse mobile tap target threshold of **44px × 44px**.
- Explicit focus rings (`:focus-visible`) need consistent contrast.
- Cart count badge should have high contrast and clear screen-reader announcement (`aria-label`).

### Issue 4: Product Badges
- In `ProductCard.tsx`, an `if-else` block renders `Bestseller` **in place of** the discount badge. As a result, bestseller products do not display their savings percentage.
- Discount percentages should be computed dynamically from `price` vs `mrp` on all discounted items and displayed consistently in one corner (e.g. top-left), while "Bestseller" appears in a distinct location (e.g. top-right).
- A unified `<ProductBadge/>` component should be created.

### Issue 5: Repetitive Marketing Vocabulary
- The phrases `"100% unpolished"`, `"zero chemical polish"`, and `"stone-cleaned"` are repeated more than 20 times across the homepage alone.
- Re-architecting copy to feature each term once in the Hero and once in the Sourcing/Process section, and substituting other occurrences with specific nutritional and culinary benefits (e.g., "fiber bran intact", "naturally low glycemic index", "air-winnowed", "rain-fed native harvest").

---

## 5. Routes Inventory

| Route | Type | Purpose | Status |
| :--- | :--- | :--- | :--- |
| `/` | SSR / ISR Page | Editorial Homepage with Hero, Category Showcase, Process, Reviews | Active |
| `/shop` | Client Page | Filterable product catalog with category, price, and sorting tabs | Active |
| `/millets` | SSR Page | Chiru Dhanyalu dedicated category page | Active |
| `/spices` | SSR Page | Cold-ground single-origin spices category page | Active |
| `/products/[slug]` | Dynamic Page | Detailed product page with weight selector, nutrition, batch CoA | Active |
| `/cart` | Client Page | Full cart review, free shipping progress meter, checkout link | Active |
| `/checkout` | Client Page | Address selector and checkout state preparation | Active |
| `/checkout/payment`| Client Page | Payment method selection (UPI, Cards, Netbanking, COD, Razorpay) | Active |
| `/order-success` | Client Page | Order confirmation landing | Active |
| `/about` | Static Page | Brand heritage, farmer cluster origin, philosophy | Active |
| `/sourcing` | Static Page | Deccan plateau farming, organic practices, dryland harvest | Active |
| `/quality` | Static Page | Quality protocols, NABL lab test verification overview | Active |
| `/recipes` | Static Page | Traditional and modern millet cooking recipes | Active |
| `/journal` | Static Page | Agrarian articles, nutrition science, storage tips | Active |
| `/faq` | Static Page | Frequently asked cooking, shipping, and storage questions | Active |
| `/shipping-policy` | Static Page | Delivery timelines, charges, and free shipping policy | Active |
| `/refund-policy` | Static Page | Return, cancellation, and refund guidelines | Active |
| `/privacy-policy` | Static Page | Data protection and cookie information | Active |
| `/terms` | Static Page | Terms of service and agricultural variation disclaimers | Active |

# DHARVIKA GRAINS — Storefront Evolution Changelog

All notable changes across storefront UI/UX, typography, conversion, trust, SEO, and performance are documented here phase by phase.

---

## [Phase 1: Consistency Bugs] - Completed

### 1. Free Shipping Threshold Harmonization
- Created central site configuration in [src/config/site.ts](file:///Users/pavangeesala/Desktop/dharvikagrain-main/src/config/site.ts) with `SHIPPING_FREE_THRESHOLD = 500` and `SHIPPING_FLAT_RATE = 49`.
- Reconciled [brandConfig.ts](file:///Users/pavangeesala/Desktop/dharvikagrain-main/src/data/brandConfig.ts) to link to the shared shipping threshold.
- Fixed conflicting ₹999 claim in Hero trust strip on [src/app/page.tsx](file:///Users/pavangeesala/Desktop/dharvikagrain-main/src/app/page.tsx) to match ₹500 (`Complimentary Delivery Above ₹500`).
- Bound trust strip in [Footer.tsx](file:///Users/pavangeesala/Desktop/dharvikagrain-main/src/components/layout/Footer.tsx) to `SHIPPING_FREE_THRESHOLD`.
- Standardized live cart progress message across [CartDrawer.tsx](file:///Users/pavangeesala/Desktop/dharvikagrain-main/src/components/cart/CartDrawer.tsx) and [src/app/cart/page.tsx](file:///Users/pavangeesala/Desktop/dharvikagrain-main/src/app/cart/page.tsx) ("Add ₹X more for Complimentary Shipping").

### 2. Dynamic Metadata, Theme Color & Canonical URLs
- Updated [src/app/layout.tsx](file:///Users/pavangeesala/Desktop/dharvikagrain-main/src/app/layout.tsx) `metadataBase` to derive from `SITE_URL` (`NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_APP_URL`).
- Added Next.js `Viewport` export with theme color (`#354C36`), color scheme, and device scaling.
- Configured canonical alternates (`canonical: '/'`) in root layout and per-page layouts ([/shop/layout.tsx](file:///Users/pavangeesala/Desktop/dharvikagrain-main/src/app/shop/layout.tsx), [/cart/layout.tsx](file:///Users/pavangeesala/Desktop/dharvikagrain-main/src/app/cart/layout.tsx), [/millets/page.tsx](file:///Users/pavangeesala/Desktop/dharvikagrain-main/src/app/millets/page.tsx), [/spices/page.tsx](file:///Users/pavangeesala/Desktop/dharvikagrain-main/src/app/spices/page.tsx)).
- Updated [robots.ts](file:///Users/pavangeesala/Desktop/dharvikagrain-main/src/app/robots.ts) and [sitemap.ts](file:///Users/pavangeesala/Desktop/dharvikagrain-main/src/app/sitemap.ts) to construct sitemap and canonical URLs dynamically from `SITE_URL`.

### 3. Header Action Buttons & WCAG Tap Targets
- Upgraded desktop and mobile commerce controls in [Header.tsx](file:///Users/pavangeesala/Desktop/dharvikagrain-main/src/components/layout/Header.tsx):
  - 44px minimum tap target compliance (`min-w-[44px] min-h-[44px]`).
  - High-visibility focus indicators (`focus-visible:ring-2 focus-visible:ring-[#354C36]`).
  - Accessible `aria-label` attributes for screen readers on search, account, wishlist, cart, and mobile menu toggles.
  - High-contrast cart badge with screen reader announcement support.

### 4. Reusable Product Badge & Discount Positioning
- Created [src/components/ui/ProductBadge.tsx](file:///Users/pavangeesala/Desktop/dharvikagrain-main/src/components/ui/ProductBadge.tsx) supporting `'discount'`, `'bestseller'`, `'category'`, and `'fresh-harvest'`.
- Integrated into [ProductCard.tsx](file:///Users/pavangeesala/Desktop/dharvikagrain-main/src/components/product/ProductCard.tsx):
  - Every discounted product shows its computed savings percentage (`price` vs `mrp`) consistently in the top-left corner.
  - "Bestseller" badge is positioned independently in the top-right corner, ensuring bestseller status never masks the discount.

### 5. Dynamic Footer Category Verification
- Updated [Footer.tsx](file:///Users/pavangeesala/Desktop/dharvikagrain-main/src/components/layout/Footer.tsx) to verify catalog presence (`products.some(p => p.category.toLowerCase().includes('oil'))`).
- Automatically hides the "Wood-Pressed Oils" link until oil SKUs are introduced into the catalog, eliminating dead navigation links.

### 6. Marketing Vocabulary De-duplication
- Curated copy across [src/app/page.tsx](file:///Users/pavangeesala/Desktop/dharvikagrain-main/src/app/page.tsx):
  - Retained "unpolished" once in the Hero eyebrow and once in the Sourcing/Process section.
  - Retained "stone-cleaned" once in the Hero narrative.
  - Retained "zero chemical polish" once in the Process benefits.
  - Replaced repetitive instances with specific nutritional, culinary, and agricultural benefits: "nutrient-rich bran layer 100% intact", "wholesome, nutrient-dense whole grains", "natural bran preserved", and "pure native grains".

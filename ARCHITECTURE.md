# DHARVIKA GRAINS — Architecture & Folder Structure

This project follows the modern Next.js 16 App Router full-stack architecture with strict separation between **Frontend** (client-side presentation and state) and **Backend** (server-side APIs, database invariants, and external integrations).

---

## 📂 Project Organization

```text
dharvikagrain-main/
├── prisma/                          # Database ORM Schemas & Definitions
│   └── schema.prisma                # Relational schema (Users, Profiles, Products, Batches, Inventory, Carts, Orders)
│
├── supabase/                        # Database Migrations & Security
│   └── migrations/                  # Versioned SQL migrations with Row Level Security (RLS)
│       ├── 20260924000001_create_profiles_and_rls.sql
│       ├── 20260924000002_create_products_and_rls.sql
│       ├── 20260924000003_create_inventory_and_batches_rls.sql
│       └── 20260924000004_create_carts_and_rls.sql
│
├── scripts/                         # Automated Verification & Gate Test Suites
│   ├── test_gate2.js                # Profile & Role Architecture Tests (28 tests)
│   ├── test_gate3.js                # Product Catalog & RLS Tests (44 tests)
│   ├── test_gate4.js                # Inventory, Batches & Traceability Tests (39 tests)
│   └── test_gate5.js                # Customer Cart & Authoritative Pricing Tests (62 tests)
│
├── public/                          # Static Frontend Assets
│   ├── images/                      # High-resolution product & farm photography
│   └── icons/                       # Brand badges and UI assets
│
└── src/
    ├── app/                         # NEXT.JS APP ROUTER
    │   │
    │   │── (Frontend Pages & Layouts)
    │   ├── page.tsx                 # Brand Storefront Homepage
    │   ├── shop/                    # All Products & Catalog filters
    │   ├── millets/                 # Dedicated Millets Category Hub
    │   ├── spices/                  # Dedicated Spices Category Hub
    │   ├── cart/                    # Shopping Cart Page
    │   ├── checkout/                # Multi-step Checkout & Payment confirmation
    │   ├── product/ & products/     # Dynamic Product Detail Views ([slug])
    │   ├── signin/ & signup/        # Customer Authentication Portals
    │   ├── forgot-password/         # Password Reset & Recovery
    │   ├── account/                 # Customer Hub (Orders, Profile, Addresses, Coupons)
    │   └── admin/                   # Secure Admin Portal (Dashboard, Products, Inventory, Batches, Orders)
    │
    │   └── api/                     # BACKEND REST API HANDLERS
    │       ├── account/             # Customer profile & address management
    │       ├── admin/               # Administrative operations (products, inventory, batches, roles, analytics)
    │       ├── auth/                # Session issuance, OTP dispatch, verification, logout
    │       ├── cart/                # Authoritative cart management & server-side subtotal calculations
    │       ├── orders/              # Order lifecycle & lookup
    │       ├── payments/            # Razorpay order generation, webhook signature verification
    │       ├── products/            # Catalog query with published status enforcement
    │       └── shipping/            # Pincode serviceability & fee calculations
    │
    ├── components/                  # FRONTEND UI COMPONENTS
    │   ├── cart/                    # Cart Drawer, Cart Line Item widgets
    │   ├── layout/                  # Navbar, Header, Footer, Announcement Bar, AppShell
    │   ├── product/                 # Product Card, Weight Selector, Nutrition Table
    │   ├── support/                 # Support Modal, WhatsApp CTA, FAQ accordion
    │   └── ui/                      # Primitive design components (Buttons, Inputs, Badges)
    │
    ├── context/                     # FRONTEND CLIENT STATE
    │   ├── CartContext.tsx          # Shopping Cart state with automatic server synchronization
    │   └── WishlistContext.tsx      # Saved items & customer favorites
    │
    ├── data/                        # DOMAIN DATA & CATALOG DEFINITIONS
    │   ├── brandConfig.ts           # Global brand settings, shipping thresholds, support contacts
    │   ├── products.ts              # Canonical product attributes, origins, processing methods
    │   └── coupons.ts               # Promotion configurations & discounts
    │
    ├── lib/                         # BACKEND SERVICES & INFRASTRUCTURE
    │   ├── auth/                    # Session management, crypto hashing, role assertions
    │   ├── db/                      # Transactional database store, Prisma client singleton
    │   ├── email/                   # Resend API integration & transactional email templates
    │   ├── payments/                # Razorpay SDK client & cryptographic webhook signature checks
    │   ├── shipping/                # Logistics providers & shipping calculation engine
    │   ├── sms/                     # MSG91 SMS gateway integration
    │   ├── supabase/                # SSR browser client, server client, and session middleware
    │   └── utils.ts                 # Formatting utilities & class name merging
    │
    ├── types/                       # SHARED TYPESCRIPT DEFINITIONS
    │   └── index.ts                 # Domain interfaces (Product, CartItem, Order, User, etc.)
    │
    └── middleware.ts                # Next.js Edge Auth & Protected Route Boundary
```

---

## 🛡️ Architectural Principles

1. **Frontend / Backend Boundary**:
   - Frontend UI (`src/app` pages, `src/components`, `src/context`) renders views and interacts with server via standard HTTP fetch calls to `/api/*`.
   - Backend APIs (`src/app/api/*`) and Services (`src/lib/*`) handle authentication, role verification, database transactions, and authoritative calculations.

2. **Authoritative Server Calculations**:
   - Prices, discounts, line totals, and shipping rates are **never** trusted from client requests. They are calculated server-side in `src/lib/db/` and verified against the canonical catalog.

3. **Data Protection & Row Level Security (RLS)**:
   - Supabase PostgreSQL enforces RLS across `profiles`, `products`, `batches`, `inventory`, `inventory_transactions`, `carts`, and `cart_items`.
   - Cross-customer data access is blocked by RLS policies (`auth.uid() = user_id`) and API-level assertions.

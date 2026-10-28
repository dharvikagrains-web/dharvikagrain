-- =============================================================================
-- DHARVIKA GRAINS — Deterministic Local Development Seed File
-- File: supabase/seed.sql
-- =============================================================================
-- Scope:
--   1. Product Catalog (15 Canonical Storefront Products)
--   2. Crop Batches (Traceability & NABL Verification Records)
--   3. Inventory SKUs (Ground variants, selling prices, MRPs, local fixtures)
--   4. Promotional Coupons (WELCOME10, FIRSTORDER, TRADITION10, FREESHIP)
--
-- Safety Guarantees:
--   - Idempotent and repeatable (ON CONFLICT clauses).
--   - Does NOT reset live stock balances, decrement counters, or order sequences.
--   - Zero personal identifiable information (PII), fake customer records, or orders.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- SECTION 1: Product Catalog (15 Canonical Products)
-- Normalized categories: 'Millets', 'Spices', 'Combo Packs'
-- -----------------------------------------------------------------------------
INSERT INTO public.products (
  id,
  name,
  slug,
  category,
  description,
  images,
  price,
  compare_price,
  weight,
  unit,
  is_available,
  status,
  local_name,
  tagline,
  short_description,
  weights,
  ingredients,
  origin_details,
  processing_details,
  cooking_instructions,
  culinary_uses,
  storage_instructions,
  nutrition_facts,
  badges,
  batch_info,
  lab_test_details,
  is_bestseller,
  is_featured,
  rating,
  review_count
) VALUES
(
  'millet-korralu',
  'Korralu (Foxtail Millet)',
  'korralu-foxtail-millet',
  'Millets',
  'Korralu (Foxtail Millet) is one of the oldest cultivated grains in the Indian subcontinent. Sourced directly from traditional dryland farmer clusters, our grains are gently unpolished to preserve the natural bran layer, essential dietary fibers, and micronutrients. Perfect for fluffy rice alternatives, wholesome upmas, and savory pongal.',
  ARRAY['/images/products/korralu-foxtail-millet.jpg'],
  95.00,
  120.00,
  500.00,
  'g',
  true,
  'PUBLISHED',
  'కొర్రలు / Kangni / Navane',
  'Ancient, wholesome grain prized for easy daily cooking and subtle nutty taste.',
  'Naturally unpolished Foxtail Millet, multi-stage air cleaned and stone-picked. Tiny golden-yellow spherical seeds. A versatile daily substitute for white rice.',
  '[{"size": "500g", "price": 95, "mrp": 120, "inStock": true}, {"size": "1kg", "price": 180, "mrp": 230, "inStock": true}]'::jsonb,
  ARRAY['100% Whole Foxtail Millet (Setaria italica)'],
  'Ananthapuramu & Kurnool Dryland Collective, Andhra Pradesh',
  'De-husked through gentle low-heat mechanical friction, multi-pass gravity separator, optical de-stoned, and packed without chemical fumigants.',
  ARRAY[
    'Rinse the millets thoroughly 2–3 times in fresh water.',
    'Soak for 30–45 minutes for softer texture and optimal digestibility.',
    'For rice consistency: Use 1:2 ratio (1 cup millet to 2 cups water). Pressure cook for 2 whistles or cook open-pot for 15–18 minutes on low flame.',
    'Let it rest covered for 5 minutes before gently fluffing with a fork.'
  ],
  ARRAY[
    'Daily rice bowl substitute with sambar, dal, or rasam',
    'South Indian Korrala Pongal with crushed pepper and cumin',
    'Vegetable upma, pulao, and fermented idli/dosa batter'
  ],
  'Store in an airtight stainless steel or glass container in a cool, dry pantry away from direct sunlight.',
  '{"servingSize": "100g raw", "energyKcal": "351 kcal", "protein": "12.3 g", "carbohydrates": "60.9 g", "dietaryFiber": "8.0 g", "fat": "4.3 g", "minerals": "Iron, Magnesium, Phosphorus, B-vitamins"}'::jsonb,
  ARRAY['Bestseller', 'Featured'],
  '{"batchPrefix": "KRL", "shelfLifeMonths": 9, "fssaiCategory": "Whole Cereals & Millets", "packagingType": "Food-grade multi-layer moisture barrier pouch"}'::jsonb,
  'NABL Certificate #TC-8821: Moisture 10.8%, Negative Aflatoxin, 0% Chemical Polish',
  true,
  true,
  4.9,
  38
),
(
  'millet-samalu',
  'Samalu (Little Millet)',
  'samalu-little-millet',
  'Millets',
  'Samalu (Little Millet) features delicate, ultra-fine round ivory-cream grains that cook into a tender, melt-in-the-mouth texture. Carefully grown in drought-resilient Deccan soils, it is celebrated in traditional Indian fasting diets and daily family meals for its gentle digestive comfort.',
  ARRAY['/images/products/samalu-little-millet.jpg'],
  90.00,
  115.00,
  500.00,
  'g',
  true,
  'PUBLISHED',
  'సామలు / Kutki / Saame',
  'Tender, fast-cooking grain ideal for soft khichdi, idli, and wholesome breakfasts.',
  'Minimally processed Little Millet grains with natural bran intact. Exceptionally tiny ivory-cream seeds that cook quickly.',
  '[{"size": "500g", "price": 90, "mrp": 115, "inStock": true}, {"size": "1kg", "price": 175, "mrp": 220, "inStock": true}]'::jsonb,
  ARRAY['100% Whole Little Millet (Panicum sumatrense)'],
  'Kurnool Dryland Collective & Bellary Sourcing Belt, South India',
  'Mechanically dehulled, precision air-blown to remove chaff, triple sorted for impurities.',
  ARRAY[
    'Rinse 2 times until water runs clear.',
    'Soak for 20–30 minutes.',
    'Use 1:2.25 water ratio for rice, or 1:3 for a soft comforting khichdi.',
    'Cook covered on medium-low flame for 12–14 minutes.'
  ],
  ARRAY[
    'Samala Khichdi with seasonal vegetables',
    'Fermented crisp dosas',
    'Millet curd rice (Thayir Sadam style)'
  ],
  'Keep in an airtight jar in a cool, moisture-free location.',
  '{"servingSize": "100g raw", "energyKcal": "346 kcal", "protein": "10.1 g", "carbohydrates": "65.5 g", "dietaryFiber": "7.6 g", "fat": "3.9 g", "minerals": "Zinc, Iron, Calcium"}'::jsonb,
  ARRAY['Featured'],
  '{"batchPrefix": "SML", "shelfLifeMonths": 9, "fssaiCategory": "Whole Cereals & Millets", "packagingType": "Food-grade moisture barrier pouch"}'::jsonb,
  'NABL Certificate #TC-9014: Moisture 11.1%, Zero Synthetic Residue, 99.7% Grain Purity',
  false,
  true,
  4.8,
  22
),
(
  'millet-arikelu',
  'Arikelu (Kodo Millet)',
  'arikelu-kodo-millet',
  'Millets',
  'Arikelu (Kodo Millet) has sustained generations across peninsular India. Known for its robust structure and rich reddish-brown hull, our unpolished Kodo millet delivers a satisfying, wholesome bite that pairs beautifully with spicy curries, curd, and lentil stews.',
  ARRAY['/images/products/arikelu-kodo-millet.jpg'],
  98.00,
  125.00,
  500.00,
  'g',
  true,
  'PUBLISHED',
  'అరికెలు / Kodra / Varagu',
  'Traditional rustic grain known for deep satiety, rich fiber, and slow-release energy.',
  'Dense, earthy Kodo Millet with characteristic reddish-brown bran hue. Cultivated in red soil belts. Excellent for hearty South Indian lunches.',
  '[{"size": "500g", "price": 98, "mrp": 125, "inStock": true}, {"size": "1kg", "price": 185, "mrp": 240, "inStock": true}]'::jsonb,
  ARRAY['100% Whole Kodo Millet (Paspalum scrobiculatum)'],
  'Mahabubnagar Red-Soil Collective, Telangana',
  'Single-dehulled gently, fiber layer preserved, optical color-sorted, unpolished.',
  ARRAY[
    'Rinse thoroughly and soak for at least 1 hour (soaking softens the firm outer grain).',
    'Use 1:2.5 water ratio for open cooking, or 1:2 for pressure cooker (3 whistles).',
    'Allow steam to settle naturally before serving.'
  ],
  ARRAY[
    'Traditional Arikelu Bisi Bele Bath',
    'Arikelu curd rice with mustard tempering',
    'Steamed idlis and savory porridge (Ganji)'
  ],
  'Store sealed in a dry container.',
  '{"servingSize": "100g raw", "energyKcal": "353 kcal", "protein": "8.3 g", "carbohydrates": "65.9 g", "dietaryFiber": "9.0 g", "fat": "1.4 g", "minerals": "Polyphenols, Phosphorus, Iron"}'::jsonb,
  ARRAY['Bestseller', 'Featured'],
  '{"batchPrefix": "ARK", "shelfLifeMonths": 9, "fssaiCategory": "Whole Cereals & Millets", "packagingType": "Food-grade moisture barrier pouch"}'::jsonb,
  'NABL Certificate #TC-7412: Moisture 10.4%, Passed 140+ Pesticide Screens, 99.9% Purity',
  true,
  true,
  4.9,
  31
),
(
  'millet-udalu',
  'Udalu (Barnyard Millet)',
  'udalu-barnyard-millet',
  'Millets',
  'Udalu (Barnyard Millet) is a staple across hill and dryland ecosystems. It is remarkably light on the palate and cooks twice as fast as conventional rice, making it an everyday culinary favorite for modern busy households seeking wholesome heritage nourishment.',
  ARRAY['/images/products/udalu-barnyard-millet.jpg'],
  95.00,
  120.00,
  500.00,
  'g',
  true,
  'PUBLISHED',
  'ఊదలు / Sanwa / Kuthiraivali',
  'Light, fast-growing millet offering a mild earthy taste and tender fluffiness.',
  'High-fiber, low-glycemic traditional Barnyard Millet with pale grey-cream spherical seeds. Cooks in just 12 minutes.',
  '[{"size": "500g", "price": 95, "mrp": 120, "inStock": true}, {"size": "1kg", "price": 180, "mrp": 230, "inStock": true}]'::jsonb,
  ARRAY['100% Whole Barnyard Millet (Echinochloa esculenta)'],
  'Deccan Rain-fed Smallholder Union, Andhra Pradesh & Karnataka',
  'Precision destoned, mechanical hull separation, screened to eliminate dust particles.',
  ARRAY[
    'Rinse twice in fresh cold water.',
    'Soak for 20 minutes.',
    'Use 1:2 ratio of water. Simmer on low heat for 10–12 minutes until all water is absorbed.'
  ],
  ARRAY[
    'Udala Pulao with whole spices',
    'Soft morning upma',
    'Steamed millet bowls with dal tadka'
  ],
  'Store airtight in cool, dry conditions.',
  '{"servingSize": "100g raw", "energyKcal": "342 kcal", "protein": "11.6 g", "carbohydrates": "65.5 g", "dietaryFiber": "10.1 g", "fat": "3.9 g", "minerals": "High bio-available iron, zinc"}'::jsonb,
  ARRAY[]::TEXT[],
  '{"batchPrefix": "UDL", "shelfLifeMonths": 9, "fssaiCategory": "Whole Cereals & Millets", "packagingType": "Food-grade moisture barrier pouch"}'::jsonb,
  'NABL Certificate #TC-6102: Moisture 10.9%, Low Glycemic Index Verified, 0% Heavy Metals',
  false,
  false,
  4.7,
  16
),
(
  'millet-ragi',
  'Ragi (Finger Millet / Flour)',
  'ragi-finger-millet',
  'Millets',
  'Ragi (Finger Millet) has been the backbone of southern agricultural diets for millennia. Packed with natural calcium, iron, and deep earthy flavor, our whole ragi grains are harvested at full maturity, sun-cured, and thoroughly cleaned to bring purest nutritional heritage into your home.',
  ARRAY['/images/products/ragi-finger-millet.jpg'],
  65.00,
  85.00,
  500.00,
  'g',
  true,
  'PUBLISHED',
  'రాగులు / Mandua / Nachani',
  'The timeless calcium-rich staple of traditional South Indian homes.',
  'Whole, cleaned deep maroon-brown Finger Millet grains. Look like tiny spherical mustard seeds. The legendary grain for Ragi Mudde, rotis, and malt.',
  '[{"size": "500g", "price": 65, "mrp": 85, "inStock": true}, {"size": "1kg", "price": 120, "mrp": 160, "inStock": true}]'::jsonb,
  ARRAY['100% Whole Finger Millet Grains (Eleusine coracana)'],
  'Chittoor Rain-fed Grower Union, Andhra Pradesh & Mandya Collective, Karnataka',
  'Aspirated to remove dry husks, magnetically separated, vibration-sieved for uniform density.',
  ARRAY[
    'For flour: Dry roast on gentle heat for 3 minutes, cool, and fine-mill.',
    'For Ragi Malt / Porridge: Whisk flour with cold water, simmer with milk/buttermilk until thick and glossy.',
    'For Ragi Mudde: Boil water with a pinch of salt, steadily stir in flour with a wooden spatula until firm ball forms.'
  ],
  ARRAY[
    'Ragi Mudde / Sankati with spicy natukodi chicken or dal',
    'Crispy Ragi Dosa',
    'Wholesome breakfast Ragi Malt'
  ],
  'Store in an airtight bin away from moisture.',
  '{"servingSize": "100g raw", "energyKcal": "328 kcal", "protein": "7.3 g", "carbohydrates": "72.0 g", "dietaryFiber": "11.5 g", "fat": "1.3 g", "minerals": "Calcium (344mg), Iron, Polyphenols"}'::jsonb,
  ARRAY['Bestseller', 'Featured'],
  '{"batchPrefix": "RAG", "shelfLifeMonths": 12, "fssaiCategory": "Whole Cereals & Millets", "packagingType": "Food-grade multi-layer pouch"}'::jsonb,
  'NABL Certificate #TC-5519: Moisture 11.2%, Calcium 344mg/100g, 0% Chemical Fumigants',
  true,
  true,
  5.0,
  45
),
(
  'millet-jowar',
  'Jowar (Sorghum)',
  'jowar-sorghum',
  'Millets',
  'Jowar (White Sorghum) is celebrated across the Deccan plateau for its cooling attributes, mild taste, and versatile flour yielding tender rotis (Jonna Rotte). Our grains are sourced from rain-fed smallholders who cultivate heritage non-hybrid landraces.',
  ARRAY['/images/products/jowar-sorghum.jpg'],
  70.00,
  90.00,
  500.00,
  'g',
  true,
  'PUBLISHED',
  'జొన్నలు / Cholam / Jowar',
  'Hearty, naturally gluten-free grain for traditional rotis, flatbreads, and pops.',
  'Plump, round, ivory-cream Sorghum grain. Distinctly larger than minor millets. The gold standard for soft, hand-patted Jowar rotis.',
  '[{"size": "500g", "price": 70, "mrp": 90, "inStock": true}, {"size": "1kg", "price": 130, "mrp": 170, "inStock": true}]'::jsonb,
  ARRAY['100% Whole White Sorghum (Sorghum bicolor)'],
  'Tandur & Raichur Black-Soil Farmer Producer Organisation, Telangana/Karnataka',
  'Screened for chaff, calibrated for size, destoned, untouched by bleaches or artificial polish.',
  ARRAY[
    'Mill into fine flour for making traditional Jonna Rotte (Sorghum flatbread).',
    'Use hot water while kneading to develop natural elasticity without gluten.',
    'Whole grain can also be cracked for porridge or popped like popcorn on high heat.'
  ],
  ARRAY[
    'Traditional Jonna Rotte with spicy chutneys',
    'Jowar Upma / Dalia',
    'Popped Jowar snack'
  ],
  'Store in a clean, airtight steel container.',
  '{"servingSize": "100g raw", "energyKcal": "349 kcal", "protein": "10.4 g", "carbohydrates": "72.6 g", "dietaryFiber": "6.7 g", "fat": "1.9 g", "minerals": "Potassium, Magnesium, Iron"}'::jsonb,
  ARRAY[]::TEXT[],
  '{"batchPrefix": "JWR", "shelfLifeMonths": 12, "fssaiCategory": "Whole Cereals & Millets", "packagingType": "Food-grade multi-layer pouch"}'::jsonb,
  'NABL Certificate #TC-4482: Moisture 10.5%, Zero Polishing Agents, High Natural Fiber',
  false,
  false,
  4.8,
  19
),
(
  'spice-turmeric',
  'Pure Turmeric Powder',
  'pure-turmeric-powder',
  'Spices',
  'Our Turmeric is sourced directly from dedicated spice growers cultivating heritage Salem and Lakadong rhizomes. Harvested at peak maturity, slow sun-cured, and pulverized using slow-speed hammer mills to prevent heat-induced degradation of the volatile curcumin and essential aromatic oils.',
  ARRAY['/images/products/pure-turmeric-powder.jpg'],
  95.00,
  125.00,
  250.00,
  'g',
  true,
  'PUBLISHED',
  'పసుపు / Haldi / Manjal',
  'Deep golden, high-curcumin rhizomes ground at low temperature to retain pure oils.',
  'Pure, vibrant turmeric powder with whole cured rhizome fingers. Zero added starch, artificial yellow color, or preservatives. High curcumin content.',
  '[{"size": "250g", "price": 95, "mrp": 125, "inStock": true}, {"size": "500g", "price": 180, "mrp": 240, "inStock": true}]'::jsonb,
  ARRAY['100% Pure Curcuma Longa Rhizomes'],
  'Jaintia Hills, Meghalaya & Duggirala Sourcing Belt, Andhra Pradesh',
  'Cured, sun-dried, finger polished, and cold-milled below 40°C to preserve essential curcuminoids.',
  ARRAY[
    'Use 1/4 to 1/2 teaspoon in everyday dal, curries, and vegetable sautés.',
    'Blend with warm milk, black pepper, and honey for soothing Haldi Doodh.',
    'Mix in marinades for natural preservative and color qualities.'
  ],
  ARRAY[
    'Daily curries, rasams, and dal tadka',
    'Warm Golden Milk elixir',
    'Traditional spice pastes'
  ],
  'Keep away from moisture and direct sunlight in an opaque container.',
  '{"servingSize": "10g", "energyKcal": "35 kcal", "protein": "0.8 g", "carbohydrates": "6.5 g", "dietaryFiber": "2.1 g", "fat": "0.9 g", "minerals": "Naturally occurring Curcumin (> 7.5% content in Lakadong lot)"}'::jsonb,
  ARRAY['Bestseller', 'Featured'],
  '{"batchPrefix": "TRM", "shelfLifeMonths": 12, "fssaiCategory": "Spices and Condiments", "packagingType": "Aroma-sealed nitrogen-flushed pouch"}'::jsonb,
  'NABL Certificate #TC-1029: 7.8% High Curcumin, Lead & Heavy Metals Undetected (<0.01 ppm)',
  true,
  true,
  5.0,
  52
),
(
  'spice-red-chilli',
  'Stemless Red Chilli Powder',
  'pure-red-chilli-powder',
  'Spices',
  'Renowned for balanced piquancy and natural red color, our Red Chilli Powder is crafted from hand-selected, stemless chillies grown in the fertile black soils of Andhra Pradesh. We grind only whole chillies without filler seeds or artificial oleoresins.',
  ARRAY['/images/products/pure-red-chilli-powder.jpg'],
  110.00,
  145.00,
  250.00,
  'g',
  true,
  'PUBLISHED',
  'ఎర్ర మిరపకాయల పొడి / Lal Mirch',
  'Sun-dried Guntur chillies, de-stemmed and cold-ground for genuine heat and natural ruby hue.',
  '100% pure sun-dried red chillies with stems removed before grinding. Accompanied by whole dried Guntur chillies. No added dyes or fillers.',
  '[{"size": "250g", "price": 110, "mrp": 145, "inStock": true}, {"size": "500g", "price": 210, "mrp": 280, "inStock": true}]'::jsonb,
  ARRAY['100% Sun-Dried Red Chilli Pods (Stemless)'],
  'Guntur Dryland Farm Yard, Andhra Pradesh (Stemless Teja Variety)',
  'Hand-destemmed, solar dried, stone-crushed, and packed in oxygen-barrier packaging.',
  ARRAY[
    'Add during the oil tempering or sautéing phase to bloom full flavor.',
    'Adjust quantity according to taste preferences.'
  ],
  ARRAY[
    'South Indian vegetable and meat curries',
    'Podi blends and spice rubs',
    'Pickles and spicy chutneys'
  ],
  'Store sealed in a cool, dark cabinet.',
  '{"servingSize": "10g", "energyKcal": "31 kcal", "protein": "1.2 g", "carbohydrates": "5.6 g", "dietaryFiber": "3.4 g", "fat": "1.4 g", "minerals": "Capsaicinoids, Vitamin A, Vitamin C"}'::jsonb,
  ARRAY['Bestseller', 'Featured'],
  '{"batchPrefix": "RCH", "shelfLifeMonths": 12, "fssaiCategory": "Spices and Condiments", "packagingType": "UV-blocking oxygen barrier pouch"}'::jsonb,
  'NABL Certificate #TC-3391: Zero Synthetic Red Dye, Sudan I-IV Negative, Aflatoxin Free (<2 ppb)',
  true,
  true,
  4.9,
  41
),
(
  'spice-coriander',
  'Roasted Coriander Powder',
  'pure-coriander-powder',
  'Spices',
  'True Indian gravies derive their thickness, delicate herbal perfume, and gentle sweetness from quality coriander. Sourced from rain-fed regions where small, oil-rich coriander seeds thrive, our Dhaniya powder is gently toasted on iron pans before milling.',
  ARRAY['/images/products/pure-coriander-powder.jpg'],
  85.00,
  110.00,
  250.00,
  'g',
  true,
  'PUBLISHED',
  'ధనియాల పొడి / Dhaniya Powder',
  'Sweet, citrusy aroma from plump round coriander seeds, slow-roasted and ground.',
  'Aromatic, single-origin coriander powder with round ribbed dry coriander seeds. Brings rich body and soul to curries.',
  '[{"size": "250g", "price": 85, "mrp": 110, "inStock": true}, {"size": "500g", "price": 160, "mrp": 210, "inStock": true}]'::jsonb,
  ARRAY['100% Whole Coriander Seeds (Coriandrum sativum)'],
  'Hadoti & Kota Traditional Seed Belts, Rajasthan',
  'Slow pan-toasting, cool settling, and precision roller-milled to retain essential linalool oils.',
  ARRAY[
    'Add along with turmeric during gravy preparation to create rich aromatic base.',
    'Blend into freshly ground rasam powders and marinades.'
  ],
  ARRAY[
    'Sambar, Rasam, and Kootu base',
    'North & South Indian curries',
    'Chutneys and vegetable stir-fries'
  ],
  'Keep in an airtight jar in a cool pantry.',
  '{"servingSize": "10g", "energyKcal": "29 kcal", "protein": "1.2 g", "carbohydrates": "5.4 g", "dietaryFiber": "4.2 g", "fat": "1.7 g", "minerals": "Linalool, Iron, Potassium"}'::jsonb,
  ARRAY[]::TEXT[],
  '{"batchPrefix": "COR", "shelfLifeMonths": 9, "fssaiCategory": "Spices and Condiments", "packagingType": "Moisture-proof foil pouch"}'::jsonb,
  'NABL Certificate #TC-2208: Volatile Essential Oil 0.82% v/w, Zero Starch Adulteration',
  false,
  false,
  4.8,
  27
),
(
  'spice-cumin',
  'Fragrant Whole Cumin Seeds',
  'pure-cumin-seeds',
  'Spices',
  'The foundation of Indian tadka (tempering). Sourced from arid climate zones where hot sunny days concentrate the volatile thymol in each furrowed seed, our Jeera crackles instantly in hot ghee with an unmistakable earthy fragrance.',
  ARRAY['/images/products/pure-cumin-seeds.jpg'],
  130.00,
  165.00,
  200.00,
  'g',
  true,
  'PUBLISHED',
  'జీలకర్ర / Jeera / Seeragam',
  'Bold, slender boat-shaped cumin seeds bursting with essential thymol and warm aromatics.',
  'High essential oil whole cumin seeds. Hand-sieved for uniform plumpness and zero mud or sand particles.',
  '[{"size": "200g", "price": 130, "mrp": 165, "inStock": true}, {"size": "500g", "price": 310, "mrp": 390, "inStock": true}]'::jsonb,
  ARRAY['100% Whole Cumin Seeds (Cuminum cyminum)'],
  'Saurashtra & Unjha Heritage Seed Collective, Gujarat',
  'Spiral gravity cleaned, double optical sorted, moisture calibrated (< 8%).',
  ARRAY[
    'Add to hot ghee or cold-pressed sesame oil at 160°C until seeds sputter and turn golden.',
    'Dry roast and coarse crush for buttermilk seasoning or chaat garnishes.'
  ],
  ARRAY[
    'Tempering for dal, rice, and vegetable poriyals',
    'Jeera rice',
    'Digestive buttermilk (Majjiga)'
  ],
  'Store in dry airtight container.',
  '{"servingSize": "10g", "energyKcal": "37 kcal", "protein": "1.8 g", "carbohydrates": "4.4 g", "dietaryFiber": "1.1 g", "fat": "2.2 g", "minerals": "Thymol, Iron, Manganese"}'::jsonb,
  ARRAY['Featured'],
  '{"batchPrefix": "CMN", "shelfLifeMonths": 12, "fssaiCategory": "Spices and Condiments", "packagingType": "Multi-layer aroma sealed pouch"}'::jsonb,
  'NABL Certificate #TC-8871: Cuminaldehyde 3.2%, 99.8% Seed Cleanliness, Negative Microbial Assay',
  false,
  true,
  4.9,
  34
),
(
  'spice-black-pepper',
  'Malabar Bold Black Pepper',
  'pure-black-peppercorns',
  'Spices',
  'Known historically as the black gold of Indian trade. Sourced from shade-grown bio-diverse Western Ghats estates where vine berries are harvested by hand at dark-green maturity and naturally sun-blackened on traditional bamboo mats.',
  ARRAY['/images/products/pure-black-peppercorns.jpg'],
  160.00,
  210.00,
  200.00,
  'g',
  true,
  'PUBLISHED',
  'నల్ల మిరియాలు / Kali Mirch / Milagu',
  'High-density, hand-harvested black peppercorns with intense piperine bite.',
  'Estate-grown Malabar whole black peppercorns in dark stone mortar with crushed pepper. Wrinkled surface, high oil weight, and profound sharpness.',
  '[{"size": "200g", "price": 160, "mrp": 210, "inStock": true}, {"size": "500g", "price": 390, "mrp": 490, "inStock": true}]'::jsonb,
  ARRAY['100% Whole Black Peppercorns (Piper nigrum)'],
  'Wayanad Shaded Forest Slopes & Coorg Hills, Western Ghats',
  'Naturally sun-cured, graded for 550+ GL density, destoned, untouched by artificial coatings.',
  ARRAY[
    'Coarsely crush in a stone mortar just before serving for freshest volatile oils.',
    'Add whole berries to boiling broths, millets pongal, and rasam.'
  ],
  ARRAY[
    'Traditional South Indian Milagu Rasam',
    'Millet Ven Pongal with ghee and cashews',
    'Daily morning ginger-pepper tonic'
  ],
  'Store sealed in a glass jar away from humidity.',
  '{"servingSize": "10g", "energyKcal": "25 kcal", "protein": "1.0 g", "carbohydrates": "6.4 g", "dietaryFiber": "2.5 g", "fat": "0.3 g", "minerals": "Piperine (> 5.2%), Vitamin K, Iron"}'::jsonb,
  ARRAY['Featured'],
  '{"batchPrefix": "BKP", "shelfLifeMonths": 18, "fssaiCategory": "Spices and Condiments", "packagingType": "UV-shielded zipper standing pouch"}'::jsonb,
  'NABL Certificate #TC-4410: Piperine Content 5.4%, Density >550 g/L, Zero Mineral Oil Dressing',
  false,
  true,
  5.0,
  39
),
(
  'signature-spice-blend',
  'Signature Regional Spice Blend',
  'signature-regional-spice-blend',
  'Spices',
  'The crowning jewel of our spice collection. Crafted following an authentic generational Deccan recipe, each spice is separately roasted at tailored temperatures on cast iron griddles before being coarse-stone crushed together. Elevates daily millet khichdis, roasted tubers, curries, and warm rice with a spoonful of hot ghee.',
  ARRAY['/images/products/signature-regional-spice-blend.jpg'],
  175.00,
  225.00,
  200.00,
  'g',
  true,
  'PUBLISHED',
  'ప్రత్యేక సాంప్రదాయ మసాలా మిశ్రమం / Heritage Masala',
  'Handcrafted Deccan masala roasted on cast iron pans with heirloom spices and roasted lentils.',
  'Our flagship small-batch regional masala blend in antique bronze urli. Multi-layered warmth, roasted lentils, and whole aromatic spices formulated for everyday meals.',
  '[{"size": "200g", "price": 175, "mrp": 225, "inStock": true}, {"size": "500g", "price": 420, "mrp": 525, "inStock": true}]'::jsonb,
  ARRAY[
    'Guntur Sun-Dried Red Chillies',
    'Whole Coriander Seeds',
    'Cumin Seeds',
    'Malabar Black Pepper',
    'Salem Turmeric',
    'Roasted Chana Dal & Urad Dal',
    'Curry Leaves',
    'Hing (Asafoetida hint)'
  ],
  'Rayalaseema & Deccan Heritage Kitchens, Andhra Pradesh',
  'Individual ingredient slow-roasting on iron surfaces, small-batch stone coarse milling, zero artificial flavor or anti-caking additives.',
  ARRAY[
    'Sprinkle over hot millet rice with a drizzle of cold-pressed sesame or peanut oil.',
    'Add 1 tablespoon towards the end of making sambar or vegetable kurma for an authentic regional finish.',
    'Rub over roasted potatoes or sweet potato wedges.'
  ],
  ARRAY[
    'Hot steamed Korralu rice with ghee',
    'Millet Dosa Podi sprinkle',
    'Roasted vegetable seasoning',
    'Heritage Curries'
  ],
  'Refrigerate after opening or store sealed in an airtight dry jar for peak aroma.',
  '{"servingSize": "10g", "energyKcal": "38 kcal", "protein": "1.5 g", "carbohydrates": "5.2 g", "dietaryFiber": "2.8 g", "fat": "1.3 g", "minerals": "Complex antioxidants, Iron, Calcium"}'::jsonb,
  ARRAY['Bestseller', 'Featured'],
  '{"batchPrefix": "SIG", "shelfLifeMonths": 6, "fssaiCategory": "Proprietary Mixed Spices", "packagingType": "Triple-laminate airtight zip canister pouch"}'::jsonb,
  'NABL Certificate #TC-9901: Sensory Profile Verified, 0 Preservatives, 0 MSG, Zero Artificial Colors',
  true,
  true,
  4.9,
  64
),
(
  'combo-ancient-grain-trio',
  'Ancient Grain Trio Pack (3kg)',
  'ancient-grain-trio-pack',
  'Combo Packs',
  'The quintessential beginner to advanced millet pantry. Rotating through Korralu (Foxtail), Samalu (Little), and Arikelu (Kodo) ensures complete dietary fiber variation, balanced micronutrients, and versatile textures from morning upmas to evening rice alternatives.',
  ARRAY[
    '/images/products/korralu-foxtail-millet.jpg',
    '/images/products/samalu-little-millet.jpg',
    '/images/products/arikelu-kodo-millet.jpg'
  ],
  495.00,
  640.00,
  3.00,
  'kg',
  true,
  'PUBLISHED',
  'మూడు చిరు ధాన్యాల కాంబో (Korralu, Samalu, Arikelu)',
  'The complete daily staple kit: Foxtail, Little, and Kodo Millets (1kg each).',
  '1kg Korralu + 1kg Samalu + 1kg Arikelu. 100% unpolished, multi-stage destoned. A rotating healthy carbohydrate foundation for your monthly pantry.',
  '[{"size": "3kg (1kg x 3)", "price": 495, "mrp": 640, "inStock": true}]'::jsonb,
  ARRAY[
    '1kg Whole Unpolished Foxtail Millet (Korralu)',
    '1kg Whole Unpolished Little Millet (Samalu)',
    '1kg Whole Unpolished Kodo Millet (Arikelu)'
  ],
  'Designated Dryland Grower Clusters, Rayalaseema & Deccan Plateau',
  'De-husked through gentle low-heat mechanical friction, optical de-stoned, and individually nitrogen-purged packed.',
  ARRAY[
    'Wash grains 2-3 times in running cold water.',
    'Soak for 30-45 minutes before cooking.',
    'Use 1:2 to 1:2.5 water ratio based on desired texture.'
  ],
  ARRAY[
    'Daily white rice substitution',
    'Vegetable pulaos and biryanis',
    'Fermented idli/dosa batters',
    'Savory pongal'
  ],
  'Store in airtight containers in a cool dry pantry.',
  '{"servingSize": "100g raw blend", "energyKcal": "350 kcal", "protein": "11.8 g", "carbohydrates": "62.0 g", "dietaryFiber": "8.8 g", "fat": "3.8 g", "minerals": "High Iron, Magnesium, Phosphorous, B-Complex"}'::jsonb,
  ARRAY['Bestseller', 'Featured'],
  '{"batchPrefix": "CMB-TRIO", "shelfLifeMonths": 9, "fssaiCategory": "Whole Cereals & Millets Kit", "packagingType": "Eco-carton gift box with triple-layer moisture pouches"}'::jsonb,
  'NABL Composite Report #TC-7721: 100% Unpolished, Negative Glyphosate & Herbicide',
  true,
  true,
  5.0,
  48
),
(
  'combo-pure-spice-trio',
  'Pure Spice Heritage Trio (750g)',
  'pure-spice-heritage-trio',
  'Combo Packs',
  'Every honest Indian recipe begins with these three golden spices. Cold-ground in micro-batches to safeguard their natural volatile oils, bright aromas, and unadulterated depth.',
  ARRAY[
    '/images/products/pure-turmeric-powder.jpg',
    '/images/products/pure-red-chilli-powder.jpg',
    '/images/products/pure-coriander-powder.jpg'
  ],
  295.00,
  390.00,
  750.00,
  'g',
  true,
  'PUBLISHED',
  'సాంప్రదాయ సుగంధ ద్రవ్యాల కాంబో (పసుపు, కారం, ధనియాలు)',
  'The foundation of every Indian curry: Pure Turmeric, Guntur Chilli, and Roasted Coriander.',
  '250g Pure Turmeric Powder + 250g Stemless Red Chilli Powder + 250g Roasted Coriander Powder. Cold-ground below 40°C.',
  '[{"size": "750g (250g x 3)", "price": 295, "mrp": 390, "inStock": true}]'::jsonb,
  ARRAY[
    '250g High-Curcumin Turmeric Powder',
    '250g Stemless Guntur Chilli Powder',
    '250g Slow-Roasted Coriander Powder'
  ],
  'Lakadong/Salem, Guntur, and Regional Deccan Spice Belt',
  'Single-origin sourcing, hand-cleaning, destemming, and low-temperature pulverization.',
  ARRAY[
    'Use 1/2 tsp Turmeric in daily dals, rasam, and marinades.',
    'Add 1 tsp Coriander powder during tadka or onion sautéing.',
    'Adjust Chilli powder to taste for vibrant color and authentic warmth.'
  ],
  ARRAY[
    'Daily sambar, rasam & dal',
    'Dry vegetable curries (Vepudu)',
    'Heritage non-veg and vegetarian stews'
  ],
  'Keep in airtight glass or steel spice containers away from moisture.',
  '{"servingSize": "10g blend", "energyKcal": "35 kcal", "protein": "1.2 g", "carbohydrates": "5.6 g", "dietaryFiber": "3.1 g", "fat": "1.1 g", "minerals": "Curcumin 5%+, Piperine, Essential Volatile Oils"}'::jsonb,
  ARRAY['Bestseller', 'Featured'],
  '{"batchPrefix": "CMB-SPI", "shelfLifeMonths": 12, "fssaiCategory": "Pure Ground Spices", "packagingType": "High-barrier nitrogen-flushed spice canisters"}'::jsonb,
  'NABL Certificate #TC-3312: High Volatile Oil Retained, Free of Added Coloring Agents',
  true,
  true,
  4.9,
  37
),
(
  'combo-millet-breakfast-box',
  'Everyday Millet Breakfast Box',
  'everyday-millet-breakfast-box',
  'Combo Packs',
  'Designed specifically for families transitioning to a nourishing, low-glycemic breakfast routine. Complete with recipe card for 15-minute fluffy Upma and crisp fermented Dosas.',
  ARRAY[
    '/images/products/korralu-foxtail-millet.jpg',
    '/images/products/pure-cumin-seeds.jpg',
    '/images/products/signature-regional-spice-blend.jpg'
  ],
  540.00,
  710.00,
  2.45,
  'kg',
  true,
  'PUBLISHED',
  'రోజూవారీ చిరుధాన్యాల అల్పాహార కాంబో',
  'Everything you need for nutritious morning upmas, dosas, and khichdis.',
  '1kg Foxtail Millet (Korralu) + 1kg Little Millet (Samalu) + 250g Fragrant Cumin Seeds + 200g Signature Deccan Masala.',
  '[{"size": "2.45kg Complete Kit", "price": 540, "mrp": 710, "inStock": true}]'::jsonb,
  ARRAY[
    '1kg Unpolished Korralu (Foxtail Millet)',
    '1kg Unpolished Samalu (Little Millet)',
    '250g Whole Cumin Seeds (Jeera)',
    '200g Signature Regional Spice Blend'
  ],
  'Andhra Pradesh & Deccan Growing Clusters',
  'Stone-cleaned grains and cast-iron roasted spices.',
  ARRAY[
    'Follow enclosed quick-recipe booklet for Korrala Upma, Samala Dosa, and spiced Pongal.'
  ],
  ARRAY[
    'Daily wholesome breakfast upmas',
    'Millet Pongal & Khichdi',
    'Fermented Dosas'
  ],
  'Store in airtight containers.',
  '{"servingSize": "100g meal serving", "energyKcal": "345 kcal", "protein": "11.5 g", "carbohydrates": "60.5 g", "dietaryFiber": "8.4 g", "fat": "4.0 g", "minerals": "Iron, Potassium, Calcium, Magnesium"}'::jsonb,
  ARRAY['Featured'],
  '{"batchPrefix": "CMB-BF", "shelfLifeMonths": 8, "fssaiCategory": "Breakfast Grocery Kit", "packagingType": "Rigid kraft presentation box with sealed pouches"}'::jsonb,
  'NABL Certificate #TC-1092: All Lots Verified by Certified NABL Laboratories',
  false,
  true,
  4.8,
  29
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  price = EXCLUDED.price,
  compare_price = EXCLUDED.compare_price,
  weight = EXCLUDED.weight,
  unit = EXCLUDED.unit,
  is_available = EXCLUDED.is_available,
  status = EXCLUDED.status,
  local_name = EXCLUDED.local_name,
  tagline = EXCLUDED.tagline,
  short_description = EXCLUDED.short_description,
  weights = EXCLUDED.weights,
  ingredients = EXCLUDED.ingredients,
  origin_details = EXCLUDED.origin_details,
  processing_details = EXCLUDED.processing_details,
  cooking_instructions = EXCLUDED.cooking_instructions,
  culinary_uses = EXCLUDED.culinary_uses,
  storage_instructions = EXCLUDED.storage_instructions,
  nutrition_facts = EXCLUDED.nutrition_facts,
  badges = EXCLUDED.badges,
  batch_info = EXCLUDED.batch_info,
  lab_test_details = EXCLUDED.lab_test_details,
  is_bestseller = EXCLUDED.is_bestseller,
  is_featured = EXCLUDED.is_featured,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  updated_at = timezone('utc'::text, now());


-- -----------------------------------------------------------------------------
-- SECTION 2: Crop Batches & Traceability
-- Product-prefixed batch numbers prevent collision on UNIQUE (batch_number).
-- Allowed status values: 'ACTIVE', 'DEPLETED', 'EXPIRED', 'ARCHIVED'
-- -----------------------------------------------------------------------------
INSERT INTO public.batches (
  batch_number,
  product_id,
  product_name,
  crop_name,
  manufacturing_date,
  expiry_date,
  total_quantity_kg,
  remaining_quantity_kg,
  source_region,
  farmer_cluster,
  quality_passed,
  status
) VALUES
-- 1. Ragi Batches
(
  'RAG-B001',
  'millet-ragi',
  'Ragi Flour (Finger Millet)',
  'Ragi Flour',
  '2026-07-15'::date,
  '2027-07-14'::date,
  1500.00,
  420.00,
  'Chittoor, Andhra Pradesh',
  'Chittoor Rain-fed Grower Union',
  true,
  'ACTIVE'
),
(
  'RAG-B002',
  'millet-ragi',
  'Ragi Flour (Finger Millet)',
  'Ragi Flour',
  '2026-08-10'::date,
  '2027-08-09'::date,
  1800.00,
  1350.00,
  'Mandya, Karnataka',
  'Mandya Organic Farmers Collective',
  true,
  'ACTIVE'
),
(
  'RAG-B003',
  'millet-ragi',
  'Ragi Flour (Finger Millet)',
  'Ragi Flour',
  '2026-09-02'::date,
  '2027-09-01'::date,
  2000.00,
  2000.00,
  'Kolar, Karnataka',
  'Kolar Dryland Cluster FPO',
  true,
  'ACTIVE'
),
-- 2. Korralu Batches
(
  'KRL-B001',
  'millet-korralu',
  'Korralu (Foxtail Millet)',
  'Korralu (Foxtail Millet)',
  '2026-07-01'::date,
  '2027-06-30'::date,
  1200.00,
  180.00,
  'Ananthapuramu, Andhra Pradesh',
  'Ananthapuramu Red-Soil Cooperative',
  true,
  'ACTIVE'
),
(
  'KRL-B002',
  'millet-korralu',
  'Korralu (Foxtail Millet)',
  'Korralu (Foxtail Millet)',
  '2026-08-05'::date,
  '2027-08-04'::date,
  1500.00,
  1100.00,
  'Kurnool, Andhra Pradesh',
  'Kurnool Dryland Cooperative',
  true,
  'ACTIVE'
),
(
  'KRL-B003',
  'millet-korralu',
  'Korralu (Foxtail Millet)',
  'Korralu (Foxtail Millet)',
  '2026-09-08'::date,
  '2027-09-07'::date,
  2200.00,
  2150.00,
  'Ananthapuramu, Andhra Pradesh',
  'Ananthapuramu Red-Soil Cooperative',
  true,
  'ACTIVE'
),
-- 3. Turmeric Batches
(
  'TRM-B001',
  'spice-turmeric',
  'Pure Turmeric Powder',
  'Lakadong Turmeric Powder',
  '2026-06-20'::date,
  '2027-06-19'::date,
  600.00,
  95.00,
  'Jaintia Hills, Meghalaya',
  'Lakadong Traditional Growers Union',
  true,
  'ACTIVE'
),
(
  'TRM-B002',
  'spice-turmeric',
  'Pure Turmeric Powder',
  'Duggirala Gold Turmeric Powder',
  '2026-07-28'::date,
  '2027-07-27'::date,
  800.00,
  580.00,
  'Guntur & Duggirala, Andhra Pradesh',
  'Duggirala Spice Board Hub',
  true,
  'ACTIVE'
),
(
  'TRM-B003',
  'spice-turmeric',
  'Pure Turmeric Powder',
  'Lakadong High-Curcumin Powder',
  '2026-08-25'::date,
  '2027-08-24'::date,
  1000.00,
  960.00,
  'Jaintia Hills, Meghalaya',
  'Meghalaya High-Curcumin Collective',
  true,
  'ACTIVE'
),
-- 4. Samalu Batch
(
  'SML-B001',
  'millet-samalu',
  'Samalu (Little Millet)',
  'Samalu (Little Millet)',
  '2026-08-16'::date,
  '2027-08-15'::date,
  850.00,
  620.00,
  'Kurnool, Andhra Pradesh',
  'Kurnool Dryland Cooperative',
  true,
  'ACTIVE'
),
-- 5. Arikelu Batch
(
  'ARK-B001',
  'millet-arikelu',
  'Arikelu (Kodo Millet)',
  'Arikelu (Kodo Millet)',
  '2026-07-24'::date,
  '2027-07-23'::date,
  950.00,
  740.00,
  'Mahabubnagar, Telangana',
  'Mahabubnagar Red-Soil Collective',
  true,
  'ACTIVE'
),
-- 6. Red Chilli Batch (Corrected canonical ID spice-red-chilli)
(
  'RCH-B001',
  'spice-red-chilli',
  'Stemless Red Chilli Powder',
  'Pure Red Chilli Powder (Guntur Teja)',
  '2026-06-24'::date,
  '2027-06-23'::date,
  500.00,
  380.00,
  'Guntur, Andhra Pradesh',
  'Guntur Dryland Grower Association',
  true,
  'ACTIVE'
)
ON CONFLICT (batch_number) DO UPDATE SET
  product_id = EXCLUDED.product_id,
  product_name = EXCLUDED.product_name,
  crop_name = EXCLUDED.crop_name,
  manufacturing_date = EXCLUDED.manufacturing_date,
  expiry_date = EXCLUDED.expiry_date,
  source_region = EXCLUDED.source_region,
  farmer_cluster = EXCLUDED.farmer_cluster,
  quality_passed = EXCLUDED.quality_passed;


-- -----------------------------------------------------------------------------
-- SECTION 3: Inventory SKUs
-- Ground variants and pricing from product weights.
-- Stock balances are strictly preserved on conflict (DO UPDATE never overwrites stock).
-- -----------------------------------------------------------------------------
INSERT INTO public.inventory (
  sku,
  product_id,
  product_name,
  variant,
  batch_number,
  stock_received,
  stock_reserved,
  stock_sold,
  stock_adjusted,
  stock_returned,
  stock,
  threshold,
  status,
  selling_price,
  mrp
) VALUES
-- Foxtail Millet
('DG-KRL-500G', 'millet-korralu', 'Korralu (Foxtail Millet)', '500g', 'KRL-B001', 120, 0, 0, 0, 0, 120, 15, 'In Stock', 95.00, 120.00),
('DG-KRL-1KG',  'millet-korralu', 'Korralu (Foxtail Millet)', '1kg',  'KRL-B002',  90, 0, 0, 0, 0,  90, 15, 'In Stock', 180.00, 230.00),

-- Little Millet
('DG-SML-500G', 'millet-samalu', 'Samalu (Little Millet)', '500g', 'SML-B001', 100, 0, 0, 0, 0, 100, 15, 'In Stock', 90.00, 115.00),
('DG-SML-1KG',  'millet-samalu', 'Samalu (Little Millet)', '1kg',  'SML-B001',  80, 0, 0, 0, 0,  80, 15, 'In Stock', 175.00, 220.00),

-- Kodo Millet
('DG-ARK-500G', 'millet-arikelu', 'Arikelu (Kodo Millet)', '500g', 'ARK-B001', 100, 0, 0, 0, 0, 100, 15, 'In Stock', 98.00, 125.00),
('DG-ARK-1KG',  'millet-arikelu', 'Arikelu (Kodo Millet)', '1kg',  'ARK-B001',  80, 0, 0, 0, 0,  80, 15, 'In Stock', 185.00, 240.00),

-- Barnyard Millet
('DG-UDL-500G', 'millet-udalu', 'Udalu (Barnyard Millet)', '500g', NULL, 80, 0, 0, 0, 0, 80, 15, 'In Stock', 95.00, 120.00),
('DG-UDL-1KG',  'millet-udalu', 'Udalu (Barnyard Millet)', '1kg',  NULL, 60, 0, 0, 0, 0, 60, 15, 'In Stock', 180.00, 230.00),

-- Finger Millet (Ragi)
('DG-RAG-500G', 'millet-ragi', 'Ragi (Finger Millet / Flour)', '500g', 'RAG-B001', 150, 0, 0, 0, 0, 150, 15, 'In Stock', 65.00, 85.00),
('DG-RAG-1KG',  'millet-ragi', 'Ragi (Finger Millet / Flour)', '1kg',  'RAG-B002', 100, 0, 0, 0, 0, 100, 15, 'In Stock', 120.00, 160.00),

-- Sorghum (Jowar)
('DG-JWR-500G', 'millet-jowar', 'Jowar (Sorghum)', '500g', NULL, 80, 0, 0, 0, 0, 80, 15, 'In Stock', 70.00, 90.00),
('DG-JWR-1KG',  'millet-jowar', 'Jowar (Sorghum)', '1kg',  NULL, 60, 0, 0, 0, 0, 60, 15, 'In Stock', 130.00, 170.00),

-- Turmeric Powder
('DG-TRM-250G', 'spice-turmeric', 'Pure Turmeric Powder', '250g', 'TRM-B001', 150, 0, 0, 0, 0, 150, 15, 'In Stock', 95.00, 125.00),
('DG-TRM-500G', 'spice-turmeric', 'Pure Turmeric Powder', '500g', 'TRM-B002', 100, 0, 0, 0, 0, 100, 15, 'In Stock', 180.00, 240.00),

-- Red Chilli Powder
('DG-RCH-250G', 'spice-red-chilli', 'Stemless Red Chilli Powder', '250g', 'RCH-B001', 140, 0, 0, 0, 0, 140, 15, 'In Stock', 110.00, 145.00),
('DG-RCH-500G', 'spice-red-chilli', 'Stemless Red Chilli Powder', '500g', 'RCH-B001',  90, 0, 0, 0, 0,  90, 15, 'In Stock', 210.00, 280.00),

-- Coriander Powder
('DG-COR-250G', 'spice-coriander', 'Roasted Coriander Powder', '250g', NULL, 100, 0, 0, 0, 0, 100, 15, 'In Stock', 85.00, 110.00),
('DG-COR-500G', 'spice-coriander', 'Roasted Coriander Powder', '500g', NULL,  70, 0, 0, 0, 0,  70, 15, 'In Stock', 160.00, 210.00),

-- Cumin Seeds
('DG-CMN-200G', 'spice-cumin', 'Fragrant Whole Cumin Seeds', '200g', NULL, 100, 0, 0, 0, 0, 100, 15, 'In Stock', 130.00, 165.00),
('DG-CMN-500G', 'spice-cumin', 'Fragrant Whole Cumin Seeds', '500g', NULL,  60, 0, 0, 0, 0,  60, 15, 'In Stock', 310.00, 390.00),

-- Black Pepper
('DG-BKP-200G', 'spice-black-pepper', 'Malabar Bold Black Pepper', '200g', NULL, 80, 0, 0, 0, 0, 80, 15, 'In Stock', 160.00, 210.00),
('DG-BKP-500G', 'spice-black-pepper', 'Malabar Bold Black Pepper', '500g', NULL, 50, 0, 0, 0, 0, 50, 15, 'In Stock', 390.00, 490.00),

-- Signature Regional Spice Blend (Source SKU and stock quantity grounded)
('DG-MAS-SIG-200', 'signature-spice-blend', 'Signature Regional Spice Blend', '200g', NULL, 120, 0, 0, 0, 0, 120, 15, 'In Stock', 175.00, 225.00),
('DG-MAS-SIG-500', 'signature-spice-blend', 'Signature Regional Spice Blend', '500g', NULL,  80, 0, 0, 0, 0,  80, 15, 'In Stock', 420.00, 525.00),

-- Curated Combos (Source SKUs and stock quantities grounded)
('DG-CMB-TRIO-3K', 'combo-ancient-grain-trio', 'Ancient Grain Trio Pack (3kg)', '3kg (1kg x 3)', NULL, 85, 0, 0, 0, 0, 85, 15, 'In Stock', 495.00, 640.00),
('DG-CMB-SPI-750', 'combo-pure-spice-trio',    'Pure Spice Heritage Trio (750g)', '750g (250g x 3)', NULL, 110, 0, 0, 0, 0, 110, 15, 'In Stock', 295.00, 390.00),
('DG-CMB-BF-BOX',  'combo-millet-breakfast-box', 'Everyday Millet Breakfast Box', '2.45kg Complete Kit', NULL, 60, 0, 0, 0, 0, 60, 15, 'In Stock', 540.00, 710.00)
ON CONFLICT (sku) DO UPDATE SET
  product_id = EXCLUDED.product_id,
  product_name = EXCLUDED.product_name,
  variant = EXCLUDED.variant,
  batch_number = EXCLUDED.batch_number,
  threshold = EXCLUDED.threshold,
  selling_price = EXCLUDED.selling_price,
  mrp = EXCLUDED.mrp,
  updated_at = timezone('utc'::text, now());


-- -----------------------------------------------------------------------------
-- SECTION 4: Storefront Promotional Coupons
-- 4 Canonical coupons from src/data/coupons.ts
-- times_used is intentionally NOT modified on conflict to preserve counters.
-- -----------------------------------------------------------------------------
INSERT INTO public.coupons (
  code,
  type,
  discount_percent,
  discount_amount,
  min_order_value,
  max_discount,
  description,
  expiry_date,
  usage_limit,
  times_used,
  per_user_limit,
  is_active
) VALUES
(
  'WELCOME10',
  'PERCENTAGE',
  10.00,
  NULL,
  499.00,
  NULL,
  '10% OFF on your first purchase above ₹499',
  '2026-12-31'::date,
  500,
  0,
  1,
  true
),
(
  'FIRSTORDER',
  'FIXED',
  NULL,
  100.00,
  799.00,
  NULL,
  'Flat ₹100 OFF on orders above ₹799',
  '2026-12-31'::date,
  500,
  0,
  1,
  true
),
(
  'TRADITION10',
  'PERCENTAGE',
  10.00,
  NULL,
  399.00,
  NULL,
  '10% celebration discount on traditional grains',
  '2026-12-31'::date,
  500,
  0,
  1,
  true
),
(
  'FREESHIP',
  'FIXED',
  NULL,
  49.00,
  299.00,
  NULL,
  'Free Shipping voucher for regional farm clusters',
  '2026-12-31'::date,
  500,
  0,
  1,
  true
)
ON CONFLICT (code) DO UPDATE SET
  type = EXCLUDED.type,
  discount_percent = EXCLUDED.discount_percent,
  discount_amount = EXCLUDED.discount_amount,
  min_order_value = EXCLUDED.min_order_value,
  max_discount = EXCLUDED.max_discount,
  description = EXCLUDED.description,
  expiry_date = EXCLUDED.expiry_date,
  is_active = EXCLUDED.is_active,
  updated_at = timezone('utc'::text, now());

COMMIT;

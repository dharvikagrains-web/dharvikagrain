import { JournalArticle } from '@/types';

export const journalArticles: JournalArticle[] = [
  {
    id: 'journal-chiru-dhanyalu-guide',
    slug: 'what-are-chiru-dhanyalu-traditional-grains-explained',
    title: 'What Are Chiru Dhanyalu? Rediscovering India’s Ancient Resilient Grains',
    subtitle: 'From dryland heritage to everyday sustenance: why traditional millets matter in modern Indian kitchens.',
    category: 'Heritage & Food Culture',
    readTime: '5 min read',
    publishedDate: '12 Sep 2026',
    author: 'Editorial Kitchen Team',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1000&q=80',
    excerpt: 'Before green revolutions standardized everyday meals to polished white rice and wheat, Indian tables thrived on a diverse tapestry of small grains known locally as Chiru Dhanyalu.',
    tags: ['Chiru Dhanyalu', 'Millets', 'Indian Heritage', 'Everyday Cooking'],
    content: [
      {
        heading: 'The Cultural Memory of Small Grains',
        body: 'In Telugu, "Chiru Dhanyalu" translates literally to "precious small grains"—a respectful nod to the dense cluster of millets that sustained rural communities across semi-arid regions of Andhra Pradesh, Telangana, Karnataka, and Tamil Nadu for thousands of years. Unlike modern commercial grains that demand heavy irrigation and chemical inputs, millets grew naturally in rain-dependent drylands, weathering droughts while enriching the soil.',
      },
      {
        heading: 'Why Unpolished Matters',
        body: 'Much of modern processing strips grains of their outer husk and nutrient-dense bran layer to achieve aesthetic whiteness and prolonged commercial warehouse stability. At our brand, we maintain minimal processing: gentle de-husking that frees the edible grain while keeping the protective fiber and mineral layers intact. This preserves the natural nutty aroma and chewy texture that makes traditional grains so deeply satisfying.',
      },
      {
        heading: 'Bringing Grains into Everyday Meals',
        body: 'Transitioning to millets does not require changing your entire cuisine. The simplest approach is substitution: swap white rice with Foxtail (Korralu) for lunch curries, replace rava with coarse Little Millet (Samalu) for breakfast upma, or enjoy Kodo (Arikelu) in evening pongal. A short soaking window of 30 to 45 minutes is the key to achieving soft, light, and digestible grains every time.',
      },
    ],
  },
  {
    id: 'journal-understanding-spice-sourcing',
    slug: 'the-journey-of-pure-spices-from-soil-to-kitchen',
    title: 'The Truth About Pure Spices: Why Cold-Grinding & Origin Matter',
    subtitle: 'Understanding volatile oils, sunlight curing, and what separates real spices from commercial powders.',
    category: 'Sourcing & Purity',
    readTime: '6 min read',
    publishedDate: '04 Sep 2026',
    author: 'Sourcing & Quality Desk',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=80',
    excerpt: 'Commercial spice manufacturing often relies on high-speed pulverizers that heat spices beyond 70°C, stripping away delicate volatile aroma compounds.',
    tags: ['Pure Spices', 'Sourcing', 'Cold Grinding', 'Turmeric', 'Pepper'],
    content: [
      {
        heading: 'Volatile Essential Oils: The Soul of a Spice',
        body: 'When you crack a cumin seed or pinch fresh turmeric powder, the fragrance that rises comes from micro-droplets of volatile aromatic oils—such as curcuminoids in turmeric, linalool in coriander, and thymol in cumin. In large-scale commercial milling, industrial hammers rotate at ferocious speeds, generating intense heat. This heat oxidizes the oils before the powder ever reaches your kitchen container.',
      },
      {
        heading: 'The Low-Temperature Milling Difference',
        body: 'By sourcing high-grade sun-cured spices directly from regional agricultural clusters and grinding them in slow-speed, temperature-controlled mills below 40°C, the volatile essential oils remain trapped within the crystalline structure of the powder. The result is a powder that smells distinctly alive the moment you unseal the pouch.',
      },
      {
        heading: 'How to Store Spices for Maximum Longevity',
        body: 'Light and humidity are the primary enemies of freshly ground spices. Store them in airtight glass or stainless steel jars away from the steam of the cooking range. Never dip a wet spoon into your spice containers, and seal packaging tightly after every use.',
      },
    ],
  },
  {
    id: 'journal-cooking-millets-masterclass',
    slug: 'the-foolproof-guide-to-cooking-traditional-millets',
    title: 'The Foolproof Water-to-Grain Ratios for Fluffy Millets',
    subtitle: 'Say goodbye to sticky, mushy grains. Here is the definitive kitchen handbook for cooking each millet variety.',
    category: 'Kitchen Techniques',
    readTime: '4 min read',
    publishedDate: '28 Aug 2026',
    author: 'Editorial Kitchen Team',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1000&q=80',
    excerpt: 'Each millet has a unique grain density and starch structure. Here are the precise ratios and resting times for Korralu, Samalu, Arikelu, and Udalu.',
    tags: ['Cooking Guide', 'Kitchen Tips', 'Millets', 'Ratios'],
    content: [
      {
        heading: 'The Golden Rule: Soaking',
        body: 'Traditional unpolished millets possess a denser outer cellular matrix than polished rice. Soaking in water for 30 to 60 minutes allows moisture to penetrate to the grain center, ensuring even expansion during cooking and breaking down natural phytates for enhanced nutrient absorption.',
      },
      {
        heading: 'Water Ratios at a Glance',
        body: '• Foxtail (Korralu): 1 cup grain to 2 cups water (fluffy rice) or 2.5 cups (upma/pongal)\n• Little Millet (Samalu): 1 cup grain to 2 cups water (fast cooking, tender)\n• Kodo (Arikelu): 1 cup grain to 2.25 cups water (dense, firm bite)\n• Barnyard (Udalu): 1 cup grain to 2 cups water (light, rapid steaming)',
      },
      {
        heading: 'The Rest Period',
        body: 'Just like cooking basmati rice, never open the pot or stir immediately after the heat is turned off. Allow the steam to settle for 5 to 7 minutes with the lid firmly in place, then gently rake with the prongs of a fork.',
      },
    ],
  },
];

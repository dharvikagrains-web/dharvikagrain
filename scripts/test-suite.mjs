import http from 'http';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3000';

const results = [];

async function fetchUrl(urlPath, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, BASE_URL);
    const req = http.request(
      url,
      {
        method: options.method || 'GET',
        headers: options.headers || {},
        timeout: 10000,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let json;
          if (res.headers['content-type']?.includes('application/json')) {
            try {
              json = JSON.parse(data);
            } catch (e) {
              // ignore
            }
          }
          resolve({
            status: res.statusCode || 0,
            text: data,
            json,
            headers: res.headers,
          });
        });
      }
    );

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTest(category, name, fn) {
  const start = Date.now();
  try {
    await fn();
    results.push({ category, name, passed: true, durationMs: Date.now() - start });
  } catch (err) {
    results.push({ category, name, passed: false, details: err.message, durationMs: Date.now() - start });
  }
}

async function main() {
  console.log('=====================================================');
  console.log('   DHARVIKA GRAINS — AUTOMATED COMPREHENSIVE TEST SUITE');
  console.log('=====================================================\n');

  // --- SECTION 1: CORE STOREFRONT & MARKETING ROUTES ---
  const publicRoutes = [
    '/',
    '/shop',
    '/millets',
    '/spices',
    '/about',
    '/sourcing',
    '/quality',
    '/recipes',
    '/journal',
    '/faq',
    '/contact',
  ];

  for (const route of publicRoutes) {
    await runTest('Public Routes', `GET ${route} returns 200 OK`, async () => {
      const res = await fetchUrl(route);
      if (res.status !== 200) {
        throw new Error(`Expected 200, got ${res.status}`);
      }
      if (!res.text.includes('Dharvika Grains') && !res.text.includes('dharvika')) {
        throw new Error('Page does not contain Dharvika brand signature');
      }
    });
  }

  // --- SECTION 2: LEGAL & STATUTORY COMPLIANCE PAGES ---
  const legalRoutes = [
    '/privacy-policy',
    '/terms',
    '/refund-policy',
    '/cookie-policy',
    '/shipping-policy',
  ];

  for (const route of legalRoutes) {
    await runTest('Legal Compliance', `GET ${route} returns 200 with statutory content`, async () => {
      const res = await fetchUrl(route);
      if (res.status !== 200) {
        throw new Error(`Expected 200, got ${res.status}`);
      }
      if (res.text.length < 500) {
        throw new Error(`Page body unexpectedly short (${res.text.length} bytes)`);
      }
    });
  }

  // --- SECTION 3: AUTH & COMMERCE PAGES ---
  const commerceRoutes = [
    '/signin',
    '/signup',
    '/forgot-password',
    '/cart',
    '/admin/login',
  ];

  for (const route of commerceRoutes) {
    await runTest('Commerce & Auth', `GET ${route} loads cleanly`, async () => {
      const res = await fetchUrl(route);
      if (res.status !== 200) {
        throw new Error(`Expected 200, got ${res.status}`);
      }
    });
  }

  await runTest('Commerce & Auth', 'GET /checkout handles empty/guest cart with 200 or 307 redirect', async () => {
    const res = await fetchUrl('/checkout');
    if (res.status !== 200 && res.status !== 307 && res.status !== 302) {
      throw new Error(`Expected 200 or 307/302 redirect, got ${res.status}`);
    }
  });

  // --- SECTION 4: PRODUCT DETAIL DYNAMIC ROUTES ---
  const sampleProductSlugs = [
    'korralu-foxtail-millet',
    'samalu-little-millet',
    'arikelu-kodo-millet',
    'udalu-barnyard-millet',
    'ragi-finger-millet',
    'jowar-sorghum',
    'pure-turmeric-powder',
    'pure-red-chilli-powder',
    'pure-coriander-powder',
    'pure-cumin-seeds',
    'pure-black-peppercorns',
    'signature-regional-spice-blend',
    'ancient-grain-trio-pack',
    'pure-spice-heritage-trio',
    'everyday-millet-breakfast-box',
  ];

  for (const slug of sampleProductSlugs) {
    await runTest('Product PDPs', `GET /products/${slug} renders with pricing & batch data`, async () => {
      const res = await fetchUrl(`/products/${slug}`);
      if (res.status !== 200) {
        throw new Error(`Expected 200, got ${res.status}`);
      }
      if (!res.text.includes('Add to Harvest Cart') && !res.text.includes('₹')) {
        throw new Error('Missing cart button or currency symbol on PDP');
      }
    });
  }

  // --- SECTION 5: RECIPES & JOURNAL DYNAMIC ROUTES ---
  const sampleContentSlugs = [
    '/recipes/foxtail-millet-upma',
    '/recipes/crisp-little-millet-dosa',
    '/journal/what-are-chiru-dhanyalu-traditional-grains-explained',
  ];

  for (const route of sampleContentSlugs) {
    await runTest('Content Pages', `GET ${route} returns 200 OK`, async () => {
      const res = await fetchUrl(route);
      if (res.status !== 200) {
        throw new Error(`Expected 200, got ${res.status}`);
      }
    });
  }

  // --- SECTION 6: API ENDPOINTS ---
  await runTest('API Testing', 'GET /api/products returns product array', async () => {
    const res = await fetchUrl('/api/products');
    if (res.status !== 200) {
      throw new Error(`Expected 200, got ${res.status}`);
    }
    if (!Array.isArray(res.json) && !Array.isArray(res.json?.products)) {
      throw new Error('Response is not a products array');
    }
  });

  await runTest('API Testing', 'GET /api/shipping returns valid rate config', async () => {
    const res = await fetchUrl('/api/shipping');
    if (res.status !== 200) {
      throw new Error(`Expected 200, got ${res.status}`);
    }
  });

  await runTest('API Testing', 'POST /api/contact validates payload schema', async () => {
    const badRes = await fetchUrl('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { name: 'Test' },
    });
    if (badRes.status !== 400 && badRes.status !== 422) {
      throw new Error(`Expected 400/422 for invalid body, got ${badRes.status}`);
    }
  });

  await runTest('API Testing', 'GET /api/auth/me handles unauthenticated request', async () => {
    const res = await fetchUrl('/api/auth/me');
    if (res.status !== 200 && res.status !== 401) {
      throw new Error(`Expected 200 or 401, got ${res.status}`);
    }
  });

  // --- SECTION 7: STATIC ASSETS & PRODUCT IMAGES EXISTENCE ---
  await runTest('Asset Integrity', 'Verify all product images exist on disk in public/', async () => {
    const productsFile = fs.readFileSync(path.join(process.cwd(), 'src/data/products.ts'), 'utf-8');
    const imageMatches = productsFile.match(/\/images\/[a-zA-Z0-9_\-\/]+\.(jpg|png|webp|jpeg)/g) || [];
    const uniqueImages = Array.from(new Set(imageMatches));
    const missing = [];

    for (const imgPath of uniqueImages) {
      const diskPath = path.join(process.cwd(), 'public', imgPath);
      if (!fs.existsSync(diskPath)) {
        missing.push(imgPath);
      }
    }

    if (missing.length > 0) {
      throw new Error(`Missing ${missing.length} images: ${missing.slice(0, 5).join(', ')}...`);
    }
  });

  // --- SECTION 8: SEO METADATA & SEMANTIC HEADERS ---
  await runTest('SEO & Meta', 'Homepage contains Title, Description, and Viewport meta tags', async () => {
    const res = await fetchUrl('/');
    if (!res.text.includes('<title>') || !res.text.includes('Dharvika Grains')) {
      throw new Error('Missing or invalid <title> tag on homepage');
    }
    if (!res.text.includes('name="description"')) {
      throw new Error('Missing meta description tag');
    }
    if (!res.text.includes('viewport')) {
      throw new Error('Missing viewport tag for mobile responsiveness');
    }
  });

  // --- SECTION 9: DESIGN TOKENS & TYPOGRAPHY PRESENCE ---
  await runTest('Design Tokens', 'Homepage HTML/CSS contains new warm ivory and heritage green tokens', async () => {
    const res = await fetchUrl('/');
    const html = res.text;
    const hasIvory = html.includes('#F8F4EA') || html.includes('color-ivory') || html.includes('bg-[#F8F4EA]');
    const hasHeritageGreen = html.includes('#354C36') || html.includes('heritage-green') || html.includes('#243725');
    const hasCormorant = html.includes('Cormorant') || html.includes('font-serif');
    
    if (!hasIvory) {
      throw new Error('Homepage HTML does not contain Warm Ivory #F8F4EA');
    }
    if (!hasHeritageGreen) {
      throw new Error('Homepage HTML does not contain Heritage Green #354C36 / #243725');
    }
    if (!hasCormorant) {
      throw new Error('Homepage HTML does not apply serif editorial font');
    }
  });

  // --- SECTION 10: HOMEPAGE INTERNAL LINKS INTEGRITY ---
  await runTest('Link Integrity', 'All internal links on homepage resolve to 200 or 30x', async () => {
    const res = await fetchUrl('/');
    const hrefMatches = res.text.match(/href="(\/[a-zA-Z0-9_\-\/]*)"/g) || [];
    const internalLinks = Array.from(
      new Set(
        hrefMatches
          .map((m) => m.replace(/^href="/, '').replace(/"$/, ''))
          .filter((l) => l.startsWith('/') && !l.startsWith('/_next') && !l.includes('.'))
      )
    );

    const broken = [];
    for (const link of internalLinks.slice(0, 20)) {
      try {
        const linkRes = await fetchUrl(link);
        if (linkRes.status >= 400) {
          broken.push({ link, status: linkRes.status });
        }
      } catch (e) {
        broken.push({ link, status: 500 });
      }
    }

    if (broken.length > 0) {
      throw new Error(`Found broken internal links: ${JSON.stringify(broken)}`);
    }
  });

  // --- REPORT SUMMARY ---
  console.log('\n-----------------------------------------------------');
  console.log('               TEST RESULTS SUMMARY                  ');
  console.log('-----------------------------------------------------');

  let passedCount = 0;
  let failedCount = 0;

  for (const r of results) {
    if (r.passed) {
      passedCount++;
      console.log(`[PASS] [${r.category}] ${r.name} (${r.durationMs}ms)`);
    } else {
      failedCount++;
      console.error(`[FAIL] [${r.category}] ${r.name} - Error: ${r.details}`);
    }
  }

  console.log('-----------------------------------------------------');
  console.log(`TOTAL TESTS: ${results.length} | PASSED: ${passedCount} | FAILED: ${failedCount}`);
  console.log('=====================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});

import { prisma } from './client';

export interface ProductFilters {
  category?: string;
  search?: string;
  status?: string;
}

export function serializeProduct(product: any) {
  const price = product.price !== null && product.price !== undefined ? Number(product.price) : 0;
  const comparePrice =
    product.comparePrice !== null && product.comparePrice !== undefined
      ? Number(product.comparePrice)
      : undefined;
  const weight = product.weight !== null && product.weight !== undefined ? Number(product.weight) : 500;
  const unit = product.unit || 'g';
  const rating =
    product.rating !== null && product.rating !== undefined ? Number(product.rating) : null;
  const reviewCount = Number(product.reviewCount || 0);

  let rawWeights = product.weights;
  if (typeof rawWeights === 'string') {
    try {
      rawWeights = JSON.parse(rawWeights);
    } catch {
      rawWeights = [];
    }
  }

  let weights = Array.isArray(rawWeights) ? rawWeights : [];
  weights = weights.map((w: any) => ({
    size: String(w.size || `${weight}${unit}`),
    price: Number(w.price || price),
    mrp: Number(w.mrp || comparePrice || price),
    inStock: Boolean(w.inStock ?? product.isAvailable ?? true),
  }));

  if (weights.length === 0) {
    weights = [
      {
        size: `${weight}${unit}`,
        price,
        mrp: comparePrice || price,
        inStock: Boolean(product.isAvailable ?? true),
      },
    ];
  }

  let nutrition = product.nutritionFacts;
  if (typeof nutrition === 'string') {
    try {
      nutrition = JSON.parse(nutrition);
    } catch {
      nutrition = {};
    }
  } else if (!nutrition || typeof nutrition !== 'object') {
    nutrition = {};
  }

  let batchInfo = product.batchInfo;
  if (typeof batchInfo === 'string') {
    try {
      batchInfo = JSON.parse(batchInfo);
    } catch {
      batchInfo = {};
    }
  } else if (!batchInfo || typeof batchInfo !== 'object') {
    batchInfo = {};
  }

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category,
    description: product.description,
    images: Array.isArray(product.images) ? product.images : [],
    price,
    comparePrice,
    weight,
    unit,
    isAvailable: Boolean(product.isAvailable ?? true),
    status: product.status || 'PUBLISHED',
    createdAt:
      product.createdAt instanceof Date
        ? product.createdAt.toISOString()
        : String(product.createdAt || new Date().toISOString()),
    updatedAt:
      product.updatedAt instanceof Date
        ? product.updatedAt.toISOString()
        : String(product.updatedAt || new Date().toISOString()),
    localName: product.localName || '',
    tagline: product.tagline || '',
    shortDescription: product.shortDescription || '',
    weights,
    ingredients: Array.isArray(product.ingredients) ? product.ingredients : [],
    origin: product.originDetails || '',
    originDetails: product.originDetails || '',
    processing: product.processingDetails || '',
    processingDetails: product.processingDetails || '',
    cookingInstructions: Array.isArray(product.cookingInstructions)
      ? product.cookingInstructions
      : [],
    culinaryUses: Array.isArray(product.culinaryUses) ? product.culinaryUses : [],
    storage: product.storageInstructions || '',
    storageInstructions: product.storageInstructions || '',
    nutrition,
    nutritionFacts: nutrition,
    badges: Array.isArray(product.badges) ? product.badges : [],
    batchInfo,
    labTestDetails: product.labTestDetails || '',
    isBestseller: Boolean(product.isBestseller),
    bestseller: Boolean(product.isBestseller),
    isFeatured: Boolean(product.isFeatured),
    featured: Boolean(product.isFeatured),
    rating,
    reviewCount,
  };
}

/**
 * Retrieves catalog products from Prisma database with status filtering
 */
export async function getPublishedProducts(
  filters?: ProductFilters,
  isPrivileged: boolean = false
) {
  if (!prisma) {
    throw new Error('Database client is not available');
  }

  const where: any = {};

  // Public / non-privileged callers can ONLY see PUBLISHED products
  if (!isPrivileged) {
    where.status = 'PUBLISHED';
  } else if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.category && filters.category.toLowerCase() !== 'all') {
    const catLower = filters.category.toLowerCase();
    if (catLower === 'millets') {
      where.category = { equals: 'Millets', mode: 'insensitive' };
    } else if (catLower === 'spices') {
      where.category = { equals: 'Spices', mode: 'insensitive' };
    } else if (catLower === 'combos' || catLower === 'combo packs') {
      where.category = { equals: 'Combo Packs', mode: 'insensitive' };
    } else {
      where.category = { equals: filters.category, mode: 'insensitive' };
    }
  }

  if (filters?.search && filters.search.trim()) {
    const q = filters.search.trim();
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { slug: { contains: q, mode: 'insensitive' } },
      { category: { contains: q, mode: 'insensitive' } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { name: 'asc' },
  });

  return products.map(serializeProduct);
}

/**
 * Retrieves a single published product by its canonical slug
 */
export async function getPublishedProductBySlug(
  slug: string,
  isPrivileged: boolean = false
) {
  if (!prisma) {
    throw new Error('Database client is not available');
  }

  const cleanSlug = slug.toLowerCase().trim();
  const where: any = {
    slug: { equals: cleanSlug, mode: 'insensitive' },
  };

  if (!isPrivileged) {
    where.status = 'PUBLISHED';
  }

  const product = await prisma.product.findFirst({
    where,
  });

  if (!product) {
    return null;
  }

  return serializeProduct(product);
}

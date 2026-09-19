import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/data/products';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, couponCode, email } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Your cart is waiting for something wholesome.' },
        { status: 400 }
      );
    }

    const verifiedItems = [];
    const warnings: string[] = [];
    let subtotal = 0;

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId || p.slug === item.productId);
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product ${item.productId} was not found or is discontinued.` },
          { status: 400 }
        );
      }

      const weightOpt = product.weights.find((w) => w.size === item.selectedWeight) || product.weights[0];
      const sku = `${product.slug.toUpperCase()}-${weightOpt.size.replace(/\s+/g, '').toUpperCase()}`;

      // Check live database inventory
      const inv = db.getInventoryItem(sku);
      if (!inv || (inv.stock - inv.reserved) <= 0) {
        return NextResponse.json(
          {
            success: false,
            error: `Sorry, ${product.name} (${weightOpt.size}) is currently out of stock.`,
            outOfStockSku: sku,
          },
          { status: 409 }
        );
      }

      const availableUnits = inv.stock - inv.reserved;
      if (item.quantity > availableUnits) {
        return NextResponse.json(
          {
            success: false,
            error: `Only ${availableUnits} unit(s) of ${product.name} (${weightOpt.size}) are available. Please adjust your cart.`,
          },
          { status: 409 }
        );
      }

      // Check for price changes
      const officialPrice = weightOpt.price;
      if (item.clientPrice && item.clientPrice !== officialPrice) {
        warnings.push(
          `The price of ${product.name} (${weightOpt.size}) has changed to ₹${officialPrice}. Your cart has been updated.`
        );
      }

      const lineTotal = officialPrice * item.quantity;
      subtotal += lineTotal;

      verifiedItems.push({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        localName: product.localName,
        selectedWeight: weightOpt.size,
        price: officialPrice,
        mrp: weightOpt.mrp,
        quantity: item.quantity,
        sku,
        image: product.images[0],
        lineTotal,
      });
    }

    // Server-side shipping rules
    const freeShippingThreshold = 500;
    const flatShippingRate = 49;
    const shippingFee = subtotal >= freeShippingThreshold ? 0 : flatShippingRate;

    // Server-side coupon verification
    let discount = 0;
    let couponDetails = null;
    let couponMessage = null;

    if (couponCode) {
      const couponCheck = db.validateCoupon(couponCode, subtotal, email);
      if (couponCheck.valid && couponCheck.coupon) {
        discount = couponCheck.discount;
        couponDetails = {
          code: couponCheck.coupon.code,
          type: couponCheck.coupon.type,
          discountAmount: discount,
        };
        couponMessage = couponCheck.message;
      } else {
        warnings.push(couponCheck.message);
      }
    }

    const grandTotal = Math.max(0, subtotal + shippingFee - discount);

    return NextResponse.json({
      success: true,
      subtotal,
      shippingFee,
      discount,
      grandTotal,
      items: verifiedItems,
      warnings,
      coupon: couponDetails,
      couponMessage,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Internal error validating cart.' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth/session';

export async function GET() {
  try {
    const auth = await requireAuth(['SUPER_ADMIN', 'ADMIN', 'OPERATIONS', 'INVENTORY_MANAGER']);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const batches = db.getAllBatches();
    return NextResponse.json({ success: true, batches });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch batches' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(['SUPER_ADMIN', 'ADMIN', 'OPERATIONS']);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const {
      batchNumber,
      productId,
      productName,
      cropName,
      harvestDate,
      sourceRegion,
      farmerCluster,
      processingDate,
      millingDate,
      qualityPassed = true,
      packagingDate,
      bestBefore,
      moisturePercent,
      totalQuantityKg,
      purityPercent,
    } = body;

    if (!batchNumber || !productId || !productName || !sourceRegion) {
      return NextResponse.json(
        { error: 'Batch Number, Product, and Source Region are mandatory.' },
        { status: 400 }
      );
    }

    const newBatch = db.createBatch(
      {
        batchNumber: batchNumber.toUpperCase(),
        productId,
        productName,
        cropName: cropName || productName,
        harvestDate: harvestDate || 'Current Season',
        sourceRegion,
        farmerCluster: farmerCluster || 'Regional FPO Cluster',
        processingDate: processingDate || 'Recent',
        millingDate: millingDate || processingDate || 'Recent',
        qualityPassed: Boolean(qualityPassed),
        packagingDate: packagingDate || 'Recent',
        bestBefore: bestBefore || '12 Months from Packaging',
        moisturePercent: moisturePercent || '10.5%',
        totalQuantityKg: Number(totalQuantityKg) || 1000,
        remainingQuantityKg: Number(totalQuantityKg) || 1000,
        purityPercent: purityPercent || '99.8%',
        status: 'ACTIVE',
      },
      auth.user.email
    );

    return NextResponse.json({ success: true, batch: newBatch });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to register batch' }, { status: 500 });
  }
}

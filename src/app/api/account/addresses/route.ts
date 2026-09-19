import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const customerEmail = user ? user.email : 'pavangeesala81@gmail.com';
    const addresses = db.getAddresses(customerEmail);

    return NextResponse.json({ success: true, addresses });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const customerEmail = user ? user.email : 'pavangeesala81@gmail.com';

    const body = await req.json();
    const { id, type, fullName, mobile, pincode, houseFlat, streetArea, landmark, city, state } = body;

    // PIN code validation: 6 digit Indian pincode
    const cleanPin = pincode?.trim().replace(/\D/g, '');
    if (!cleanPin || !/^[1-9][0-9]{5}$/.test(cleanPin)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 6-digit Indian Postal PIN code.' },
        { status: 400 }
      );
    }

    if (!fullName?.trim() || !mobile?.trim() || !houseFlat?.trim() || !streetArea?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Full Name, Mobile, House/Flat, and Street/Area are mandatory.' },
        { status: 400 }
      );
    }

    const saved = db.saveAddress(customerEmail, {
      id,
      type: type || 'Home',
      fullName,
      mobile,
      pincode: cleanPin,
      houseFlat,
      streetArea,
      landmark: landmark || '',
      city: city || 'Hyderabad',
      state: state || 'Telangana',
    });

    return NextResponse.json({ success: true, address: saved });
  } catch {
    return NextResponse.json({ error: 'Failed to save address' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const customerEmail = user ? user.email : 'pavangeesala81@gmail.com';

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Address ID required' }, { status: 400 });
    }

    db.deleteAddress(customerEmail, id);
    return NextResponse.json({ success: true, message: 'Address removed.' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}

import { prisma } from './client';
import { SavedAddress } from '@/types';

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Validates that an identifier conforms strictly to UUID format (RFC 4122)
 */
export function isValidUuid(id?: string | null): boolean {
  if (!id || typeof id !== 'string') return false;
  return UUID_REGEX.test(id.trim());
}

export interface AddressInput {
  type?: string;
  isDefault?: boolean;
  fullName: string;
  mobile: string;
  pincode: string;
  houseFlat: string;
  streetArea: string;
  landmark?: string | null;
  city?: string;
  state?: string;
}

/**
 * Maps a Prisma SavedAddress model to the API SavedAddress response contract
 */
export function mapDbAddressToResponse(addr: {
  id: string;
  type: string;
  isDefault: boolean;
  fullName: string;
  mobile: string;
  pincode: string;
  houseFlat: string;
  streetArea: string;
  landmark: string | null;
  city: string;
  state: string;
}): SavedAddress {
  return {
    id: addr.id,
    type: (addr.type === 'Work' || addr.type === 'Other' ? addr.type : 'Home') as 'Home' | 'Work',
    isDefault: addr.isDefault,
    fullName: addr.fullName,
    mobile: addr.mobile,
    pincode: addr.pincode,
    houseFlat: addr.houseFlat,
    streetArea: addr.streetArea,
    landmark: addr.landmark || undefined,
    city: addr.city,
    state: addr.state,
  };
}

/**
 * Retrieves all saved addresses for a specific customer UUID.
 * Queries are strictly scoped to the authenticated user's UUID.
 */
export async function getAddressesForUser(userId: string): Promise<SavedAddress[]> {
  if (!prisma) {
    throw new Error('Database client is not available');
  }

  const records = await prisma.savedAddress.findMany({
    where: { userId },
    orderBy: [
      { isDefault: 'desc' },
      { createdAt: 'desc' },
    ],
  });

  return records.map(mapDbAddressToResponse);
}

/**
 * Creates a new saved address for the customer.
 * Enforces authenticated UUID ownership and database column normalization.
 */
export async function createAddressForUser(
  userId: string,
  userEmail: string,
  data: AddressInput
): Promise<SavedAddress> {
  if (!prisma) {
    throw new Error('Database client is not available');
  }

  const isDefault = Boolean(data.isDefault);
  const normalizedType = data.type === 'Work' || data.type === 'Other' ? data.type : 'Home';

  // If this address is default, reset existing defaults for this customer only
  if (isDefault) {
    await prisma.savedAddress.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  const created = await prisma.savedAddress.create({
    data: {
      userId,
      userEmail: userEmail.toLowerCase().trim(),
      type: normalizedType,
      isDefault,
      fullName: data.fullName.trim(),
      mobile: data.mobile.trim(),
      pincode: data.pincode.trim(),
      houseFlat: data.houseFlat.trim(),
      streetArea: data.streetArea.trim(),
      landmark: data.landmark?.trim() || null,
      city: data.city?.trim() || 'Hyderabad',
      state: data.state?.trim() || 'Telangana',
    },
  });

  return mapDbAddressToResponse(created);
}

/**
 * Updates an existing address belonging to the customer.
 * Enforces ownership: Customer A cannot modify Customer B's address.
 */
export async function updateAddressForUser(
  userId: string,
  addressId: string,
  data: AddressInput
): Promise<{ success: boolean; address?: SavedAddress; error?: string; status?: number }> {
  if (!prisma) {
    throw new Error('Database client is not available');
  }

  if (!isValidUuid(addressId)) {
    return { success: false, error: 'Address not found', status: 404 };
  }

  const existing = await prisma.savedAddress.findUnique({
    where: { id: addressId },
  });

  if (!existing) {
    return { success: false, error: 'Address not found', status: 404 };
  }

  // Strict ownership check: Must belong to caller
  if (existing.userId !== userId) {
    return {
      success: false,
      error: "Forbidden: You cannot modify another customer's address.",
      status: 403,
    };
  }

  const isDefault = Boolean(data.isDefault);
  const normalizedType = data.type === 'Work' || data.type === 'Other' ? data.type : 'Home';

  if (isDefault) {
    await prisma.savedAddress.updateMany({
      where: { userId, isDefault: true, id: { not: addressId } },
      data: { isDefault: false },
    });
  }

  const updated = await prisma.savedAddress.update({
    where: { id: addressId },
    data: {
      type: normalizedType,
      isDefault,
      fullName: data.fullName.trim(),
      mobile: data.mobile.trim(),
      pincode: data.pincode.trim(),
      houseFlat: data.houseFlat.trim(),
      streetArea: data.streetArea.trim(),
      landmark: data.landmark?.trim() || null,
      city: data.city?.trim() || 'Hyderabad',
      state: data.state?.trim() || 'Telangana',
    },
  });

  return { success: true, address: mapDbAddressToResponse(updated) };
}

/**
 * Deletes an address belonging to the customer.
 * Enforces ownership: Customer A cannot delete Customer B's address.
 */
export async function deleteAddressForUser(
  userId: string,
  addressId: string
): Promise<{ success: boolean; error?: string; status?: number }> {
  if (!prisma) {
    throw new Error('Database client is not available');
  }

  if (!isValidUuid(addressId)) {
    return { success: false, error: 'Address not found', status: 404 };
  }

  const existing = await prisma.savedAddress.findUnique({
    where: { id: addressId },
  });

  if (!existing) {
    return { success: false, error: 'Address not found', status: 404 };
  }

  // Strict ownership check: Must belong to caller
  if (existing.userId !== userId) {
    return {
      success: false,
      error: "Forbidden: You cannot delete another customer's address.",
      status: 403,
    };
  }

  await prisma.savedAddress.delete({
    where: { id: addressId },
  });

  return { success: true };
}

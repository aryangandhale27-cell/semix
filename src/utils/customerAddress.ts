import { CustomerAddress } from '../types';

export type CustomerAddressEntry = CustomerAddress & { id: string };

export const CUSTOMER_ADDRESS_STORAGE_KEY = 'semix-customer-addresses-v1';

export function getEmptyCustomerAddress(overrides: Partial<CustomerAddress> = {}): CustomerAddress {
  return {
    fullName: overrides.fullName || '',
    phone: overrides.phone || '',
    email: overrides.email || '',
    street: overrides.street || '',
    landmark: overrides.landmark || '',
    city: overrides.city || '',
    state: overrides.state || '',
    pincode: overrides.pincode || '',
    isDefault: overrides.isDefault ?? true,
  };
}

export function readSavedCustomerAddresses(): CustomerAddressEntry[] {
  try {
    const stored = localStorage.getItem(CUSTOMER_ADDRESS_STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item: any) => item && typeof item === 'object')
      .map((item: any, index: number) => ({
        id: typeof item.id === 'string' && item.id ? item.id : `addr-${Date.now()}-${index}`,
        fullName: String(item.fullName || ''),
        phone: String(item.phone || ''),
        email: String(item.email || ''),
        street: String(item.street || ''),
        landmark: String(item.landmark || ''),
        city: String(item.city || ''),
        state: String(item.state || ''),
        pincode: String(item.pincode || ''),
        isDefault: Boolean(item.isDefault),
      }));
  } catch {
    return [];
  }
}

export function writeSavedCustomerAddresses(addresses: CustomerAddressEntry[]): void {
  try {
    localStorage.setItem(CUSTOMER_ADDRESS_STORAGE_KEY, JSON.stringify(addresses));
  } catch {
    // Ignore storage failures so the app still works in restricted browser modes.
  }
}

export function buildCustomerAddressEntry(source: Partial<CustomerAddress> & { id?: string }): CustomerAddressEntry {
  return {
    fullName: source.fullName || '',
    phone: source.phone || '',
    email: source.email || '',
    street: source.street || '',
    landmark: source.landmark || '',
    city: source.city || '',
    state: source.state || '',
    pincode: source.pincode || '',
    isDefault: source.isDefault ?? true,
    id: source.id || `addr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  };
}

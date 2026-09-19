import { brandConfig } from '@/data/brandConfig';

export function formatCurrency(amount: number): string {
  return `${brandConfig.currencySymbol}${amount.toLocaleString('en-IN')}`;
}

export function calculateDiscount(price: number, mrp: number): number {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export function cn(...inputs: (string | undefined | null | false | 0)[]): string {
  return inputs.filter(Boolean).join(' ');
}

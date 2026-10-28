import React from 'react';

export type ProductBadgeType = 'discount' | 'bestseller' | 'category' | 'fresh-harvest';

interface ProductBadgeProps {
  type: ProductBadgeType;
  value?: string | number;
  className?: string;
  ariaLabel?: string;
}

export function ProductBadge({
  type,
  value,
  className = '',
  ariaLabel,
}: ProductBadgeProps) {
  if (type === 'discount') {
    const discountNumber = typeof value === 'number' ? Math.round(value) : Number(value) || 0;
    if (discountNumber <= 0) return null;

    return (
      <span
        className={`inline-flex items-center text-[9px] sm:text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-[4px] bg-[#F7EBE1] text-[#C47B4B] border border-[#EACBB5] shadow-2xs font-data ${className}`}
        aria-label={ariaLabel || `${discountNumber}% discount off MRP`}
      >
        {discountNumber}% OFF
      </span>
    );
  }

  if (type === 'bestseller') {
    return (
      <span
        className={`inline-flex items-center text-[9px] sm:text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-[4px] bg-[#354C36] text-white border border-[#243725] shadow-2xs font-data ${className}`}
        aria-label={ariaLabel || 'Bestseller product'}
      >
        Bestseller
      </span>
    );
  }

  if (type === 'fresh-harvest') {
    return (
      <span
        className={`inline-flex items-center text-[9px] sm:text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-[4px] bg-[#E7D8B8]/40 text-[#354C36] border border-[#D5C29B] font-data ${className}`}
      >
        ✦ Fresh Harvest
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center text-[9px] sm:text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-[4px] bg-white text-[#5F6156] border border-[#E7D8B8] font-data ${className}`}
    >
      {value}
    </span>
  );
}

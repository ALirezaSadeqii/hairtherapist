'use client';

import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'danger' | 'neutral' | 'accent';
  className?: string;
}

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  const variantStyles = {
    success: 'bg-[#F7EBE7] text-[#965B50] border-[#EED7D1]',
    danger: 'bg-[#FAECEE] text-[#943A47] border-[#ECC3C8]',
    neutral: 'bg-[#F5ECE7] text-[#6E5F5A] border-[#EAE0DA]',
    accent: 'bg-[#C58B80] text-white border-[#C58B80]',
  }[variant];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
}

'use client';

import React from 'react';

export interface AlertProps {
  type?: 'error' | 'success' | 'info' | 'warning';
  title?: string;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

export function Alert({
  type = 'info',
  title,
  children,
  className = '',
  onClose,
}: AlertProps) {
  const styles = {
    error: {
      container: 'bg-[#FAECEE] border-[#ECC3C8] text-[#943A47]',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0 text-[#943A47]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    success: {
      container: 'bg-[#F7EBE7] border-[#EED7D1] text-[#965B50]',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0 text-[#C58B80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    info: {
      container: 'bg-[#F5ECE7] border-[#EAE0DA] text-[#6E5F5A]',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0 text-[#6E5F5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    warning: {
      container: 'bg-[#FEF9EE] border-[#F1E4C3] text-[#7A5A14]',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0 text-[#7A5A14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
  }[type];

  return (
    <div
      role="alert"
      className={`border rounded-md p-4 text-sm flex items-start gap-3 text-start ${styles.container} ${className}`}
    >
      <div className="mt-0.5">{styles.icon}</div>
      <div className="flex-1">
        {title && <h5 className="font-semibold mb-0.5">{title}</h5>}
        <div className="leading-relaxed">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          aria-label="Dismiss alert"
          className="p-1 hover:opacity-75 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

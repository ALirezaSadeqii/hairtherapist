'use client';

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, className = '', ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full text-start">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold tracking-wider uppercase text-[#6E5F5A] mb-1.5"
          >
            {label}
            {props.required && <span className="text-[#943A47] ms-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-3.5 py-2.5 text-sm bg-white text-[#2A211D] placeholder:text-[#A89D98] border rounded transition-colors focus:outline-none focus:ring-1 ${
            error
              ? 'border-[#943A47] focus:border-[#943A47] focus:ring-[#943A47]'
              : 'border-[#EAE0DA] focus:border-[#C58B80] focus:ring-[#C58B80]'
          } disabled:bg-[#F5ECE7] disabled:text-[#94847E] disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        {error ? (
          <p className="mt-1.5 text-xs text-[#943A47] font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-[#94847E]">{helperText}</p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';

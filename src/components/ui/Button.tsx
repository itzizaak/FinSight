/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  const baseStyle = "inline-flex items-center justify-center font-mono font-bold transition-all duration-200 rounded-xl border select-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";
  
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 hover:scale-[1.01] shadow-lg shadow-indigo-600/10",
    secondary: "bg-zinc-900 hover:bg-zinc-850 text-white border-zinc-800",
    outline: "bg-transparent hover:bg-zinc-900 text-zinc-300 border-zinc-800 hover:text-white",
    danger: "bg-red-950/20 hover:bg-red-950/40 text-red-400 border-red-900/40",
    ghost: "bg-transparent hover:bg-zinc-900/50 text-zinc-400 hover:text-zinc-200 border-transparent"
  };

  const sizes = {
    xs: "px-2.5 py-1 text-[10px]",
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-4.5 py-2 text-xs",
    lg: "px-6 py-3 text-sm"
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
}

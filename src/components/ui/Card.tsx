/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "muted" | "premium" | "danger";
  className?: string;
}

export function Card({ children, variant = "default", className = "", ...props }: CardProps) {
  const baseStyle = "rounded-2xl border transition-all duration-300";
  
  const variants = {
    default: "bg-zinc-950 border-zinc-850 shadow-lg",
    muted: "bg-zinc-900/30 border-zinc-900",
    premium: "bg-gradient-to-br from-indigo-950/20 via-zinc-950 to-zinc-950 border-indigo-900/30 shadow-indigo-900/5",
    danger: "bg-red-950/5 border-red-900/20"
  };

  return (
    <div
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "", ...props }: CardHeaderProps) {
  return (
    <div className={`p-6 border-b border-zinc-900/60 ${className}`} {...props}>
      {children}
    </div>
  );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = "", ...props }: CardContentProps) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = "", ...props }: CardFooterProps) {
  return (
    <div className={`px-6 py-4 border-t border-zinc-900/60 ${className}`} {...props}>
      {children}
    </div>
  );
}

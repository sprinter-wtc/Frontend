import * as React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return <div className={`rounded-2xl border bg-white p-4 shadow ${className || ""}`}>{children}</div>;
}

export function CardContent({ children, className }: CardProps) {
  return <div className={className}>{children}</div>;
}

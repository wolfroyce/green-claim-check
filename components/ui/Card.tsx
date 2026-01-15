import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined";
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = "default",
  ...props
}) => {
  const variants = {
    default: "bg-white dark:bg-gray-800",
    elevated: "bg-white dark:bg-gray-800 shadow-sm",
    outlined: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
  };

  return (
    <div
      className={cn(
        "rounded-xl p-6 transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

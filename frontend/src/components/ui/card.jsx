import React from "react";

export const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg border bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-black shadow-sm ${className}`}
    {...props}
  />
));
Card.displayName = "Card";

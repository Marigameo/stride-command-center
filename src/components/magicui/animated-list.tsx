import React from 'react';
import { cn } from "@/lib/utils";

interface AnimatedListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
}

export const AnimatedList = React.forwardRef<HTMLDivElement, AnimatedListProps>(
  ({ className, children, delay = 1000, ...props }, ref) => {
    const childrenArray = React.Children.toArray(children);

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        {childrenArray.map((child, index) => (
          <div
            key={index}
            className="animate-in fade-in slide-in-from-bottom-4"
            style={{
              animationDelay: `${index * delay}ms`,
              animationFillMode: "both",
            }}
          >
            {child}
          </div>
        ))}
      </div>
    );
  }
);

AnimatedList.displayName = "AnimatedList"; 
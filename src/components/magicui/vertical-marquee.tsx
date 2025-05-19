import React from 'react';
import { cn } from "@/lib/utils";

interface VerticalMarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  speed?: number;
  pauseOnHover?: boolean;
  activeIndex?: number;
}

export const VerticalMarquee = React.forwardRef<HTMLDivElement, VerticalMarqueeProps>(
  ({ className, children, speed = 80, pauseOnHover = true, activeIndex = 0, ...props }, ref) => {
    const childrenArray = React.Children.toArray(children);
    const duplicatedChildren = [...childrenArray, ...childrenArray];

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden",
          pauseOnHover && "hover:[animation-play-state:paused]",
          className
        )}
        {...props}
      >
        <div
          className="flex flex-col animate-smooth-scroll"
          style={{
            animationDuration: `${speed}s`,
          }}
        >
          {duplicatedChildren.map((child, index) => {
            const originalIndex = index % childrenArray.length;
            const isActive = originalIndex === activeIndex;
            
            return (
              <div 
                key={index} 
                className={cn(
                  "flex-shrink-0",
                  isActive && "opacity-100"
                )}
              >
                {child}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

VerticalMarquee.displayName = "VerticalMarquee"; 
import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

interface ScrollAnimationProps {
  children: React.ReactNode;
  animation?: 'slide-up' | 'slide-left' | 'slide-right' | 'zoom-in' | 'flip-in' | 'bounce-in' | 'fade-in';
  delay?: number;
  className?: string;
  threshold?: number;
  triggerOnce?: boolean;
}

export const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  children,
  animation = 'slide-up',
  delay = 0,
  className = '',
  threshold = 0.1,
  triggerOnce = true,
}) => {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold,
    delay,
    triggerOnce,
  });

  const animationClass = isVisible ? `animate-${animation}` : 'opacity-0';

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={cn(animationClass, className)}
    >
      {children}
    </div>
  );
};

interface StaggeredAnimationProps {
  children: React.ReactNode[];
  animation?: 'slide-up' | 'slide-left' | 'slide-right' | 'zoom-in' | 'flip-in' | 'bounce-in' | 'fade-in';
  staggerDelay?: number;
  className?: string;
  threshold?: number;
}

export const StaggeredAnimation: React.FC<StaggeredAnimationProps> = ({
  children,
  animation = 'slide-up',
  staggerDelay = 100,
  className = '',
  threshold = 0.1,
}) => {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold,
    triggerOnce: true,
  });

  return (
    <div ref={elementRef as React.RefObject<HTMLDivElement>} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={cn(
            isVisible ? `animate-${animation}` : 'opacity-0',
            `animate-stagger-${Math.min(index + 1, 6)}`
          )}
        >
          {child}
        </div>
      ))}
    </div>
  );
};
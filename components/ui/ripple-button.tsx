"use client";

import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface RippleButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
  title?: string;
}

export const RippleButton = React.forwardRef<HTMLButtonElement, RippleButtonProps>(
  ({ children, className, title, ...props }, ref) => {
    const [isRippling, setIsRippling] = useState(false);
    const [isAttention, setIsAttention] = useState(false);

    useEffect(() => {
      const interval = setInterval(() => {
        setIsAttention(true);
        setTimeout(() => setIsAttention(false), 1000);
      }, 10000);

      return () => clearInterval(interval);
    }, []);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsRippling(true);
      setTimeout(() => setIsRippling(false), 500);
      props.onClick?.(e);
    };

    // Ensure aria-pressed is a valid boolean
    if (typeof props['aria-pressed'] !== 'undefined') {
      props['aria-pressed'] = String(props['aria-pressed']) === 'true';
    }

    return (
      <Button
        ref={ref}
        {...props}
        className={cn(
          'relative overflow-hidden transition-all',
          isRippling && 'after:content-[""] after:absolute after:inset-0 after:animate-ripple after:bg-white/20 after:rounded-full',
          isAttention && 'animate-attention ring-2 ring-primary/50',
          className
        )}
        onClick={handleClick}
        aria-label={title}
      >
        {children}
      </Button>
    );
  }
);

RippleButton.displayName = "RippleButton"; 
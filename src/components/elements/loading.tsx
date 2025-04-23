import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import type React from 'react';

import { cn } from '@utils/styles';

//  ---------------------------------------------------------------------------
//  UTILS
//  ---------------------------------------------------------------------------

const loadingVariants = cva('flex flex-col items-center gap-3 p-4', {
  variants: {
    size: {
      sm: '',
      md: '',
      lg: '',
    },
    layout: {
      centered: 'justify-center min-h-[200px]',
      inline: '',
    },
  },
  defaultVariants: {
    size: 'md',
    layout: 'centered',
  },
});

const spinnerVariants = cva('text-primary animate-spin', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-8 w-8',
      lg: 'h-12 w-12',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const textVariants = cva('font-medium text-center', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

//  ---------------------------------------------------------------------------
//  TYPES
//  ---------------------------------------------------------------------------

export interface LoadingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingVariants> {
  message?: string;
  centered?: boolean;
}

//  ---------------------------------------------------------------------------
//  UI: CORE
//  ---------------------------------------------------------------------------

export function Loading({
  message = 'Loading...',
  size,
  centered = true,
  className,
  ...props
}: LoadingProps) {
  const layout = centered ? 'centered' : 'inline';

  return (
    <div
      className={cn(loadingVariants({ size, layout, className }))}
      role="status"
      aria-live="polite"
      {...props}
    >
      <Loader2 className={cn(spinnerVariants({ size }))} />
      {message && <p className={cn(textVariants({ size }))}>{message}</p>}
    </div>
  );
}

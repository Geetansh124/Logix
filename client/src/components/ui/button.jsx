import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none',
  {
    variants: {
      variant: {
        default: 'bg-blue-600 text-white shadow hover:bg-blue-700 active:scale-[0.98]',
        polar: 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md hover:from-sky-500 hover:to-blue-600 active:scale-[0.98]',
        destructive: 'bg-red-600 text-white shadow-sm hover:bg-red-700 active:scale-[0.98]',
        outline: 'border border-slate-200 bg-white text-slate-800 shadow-xs hover:bg-slate-100 hover:text-slate-900',
        secondary: 'bg-slate-100 text-slate-900 shadow-xs hover:bg-slate-200/80',
        ghost: 'hover:bg-slate-100 text-slate-700 hover:text-slate-900',
        link: 'text-blue-600 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-6 text-sm',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = 'Button';

export { Button, buttonVariants };

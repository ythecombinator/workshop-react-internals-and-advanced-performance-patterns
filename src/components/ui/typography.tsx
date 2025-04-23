import { FunctionComponent, HTMLAttributes, PropsWithChildren } from 'react';

import { cn } from '@utils/styles';

//  ---------------------------------------------------------------------------
//  UI: Typography.h1
//  ---------------------------------------------------------------------------

const Heading1: FunctionComponent<
  PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>
> = ({ children, className, ...props }) => {
  return (
    <h1
      className={cn('text-3xl font-extrabold tracking-tight', className)}
      {...props}
    >
      {children}
    </h1>
  );
};

//  ---------------------------------------------------------------------------
//  UI: Typography.h2
//  ---------------------------------------------------------------------------

const Heading2: FunctionComponent<
  PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>
> = ({ children, className, ...props }) => {
  return (
    <h2
      className={cn(
        'font-bold text-2xl tracking-tight my-4 text-black dark:text-white',
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
};

//  ---------------------------------------------------------------------------
//  UI: Typography.h3
//  ---------------------------------------------------------------------------

const Heading3: FunctionComponent<
  PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>
> = ({ children, className, ...props }) => {
  return (
    <h3
      className={cn(
        'mt-8 scroll-m-20 text-xl font-semibold tracking-tight',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

//  ---------------------------------------------------------------------------
//  UI: Typography.lead
//  ---------------------------------------------------------------------------

const Lead: FunctionComponent<
  PropsWithChildren<HTMLAttributes<HTMLParagraphElement>>
> = ({ children, className, ...props }) => {
  return (
    <p
      className={cn(
        'text-xl font-semibold leading-8 tracking-tight',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};

//  ---------------------------------------------------------------------------
//  UI: Typography.P
//  ---------------------------------------------------------------------------

const Paragraph: FunctionComponent<
  PropsWithChildren<HTMLAttributes<HTMLParagraphElement>>
> = ({ children, className, ...props }) => {
  return (
    <p
      className={cn(
        'leading-8 text-gray-500 my-2 dark:text-gray-400',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};

//  ---------------------------------------------------------------------------
//  UI: Typography.small
//  ---------------------------------------------------------------------------

const Small: FunctionComponent<
  PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>
> = ({ children, className, ...props }) => {
  return (
    <small
      className={cn('text-sm font-medium leading-none', className)}
      {...props}
    >
      {children}
    </small>
  );
};

//  ---------------------------------------------------------------------------
//  UI: Typography.subtle
//  ---------------------------------------------------------------------------

const Subtle: FunctionComponent<
  PropsWithChildren<HTMLAttributes<HTMLParagraphElement>>
> = ({ children, className, ...props }) => {
  return (
    <p
      className={cn('text-sm text-slate-500 dark:text-slate-400', className)}
      {...props}
    >
      {children}
    </p>
  );
};

//  ---------------------------------------------------------------------------
//  UI: API
//  ---------------------------------------------------------------------------

const Typography = {
  lead: Lead,
  h1: Heading1,
  h2: Heading2,
  h3: Heading3,
  p: Paragraph,
  subtle: Subtle,
  small: Small,
  highlight: Highlight,
};

export default Typography;

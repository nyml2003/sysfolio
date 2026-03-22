import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

import { clsx } from 'clsx';

type StackGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type StackAlign = 'start' | 'center' | 'stretch';

type StackProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  gap?: StackGap;
  align?: StackAlign;
  className?: string;
};

const gapClassNameByGap: Record<StackGap, string> = {
  xs: 'sf-stack--gap-xs',
  sm: 'sf-stack--gap-sm',
  md: 'sf-stack--gap-md',
  lg: 'sf-stack--gap-lg',
  xl: 'sf-stack--gap-xl',
};

const alignClassNameByAlign: Record<StackAlign, string> = {
  start: 'sf-stack--align-start',
  center: 'sf-stack--align-center',
  stretch: 'sf-stack--align-stretch',
};

export function Stack<T extends ElementType = 'div'>({
  as,
  children,
  gap = 'md',
  align = 'stretch',
  className,
  ...rest
}: StackProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof StackProps<T>>) {
  const Component = as ?? 'div';

  return (
    <Component
      className={clsx('sf-stack', gapClassNameByGap[gap], alignClassNameByAlign[align], className)}
      {...rest}
    >
      {children}
    </Component>
  );
}

import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

import { clsx } from 'clsx';

type GridColumns = 2 | 3 | 4;

type GridProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  columns?: GridColumns;
  className?: string;
};

export function Grid<T extends ElementType = 'div'>({
  as,
  children,
  columns = 3,
  className,
  ...rest
}: GridProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof GridProps<T>>) {
  const Component = as ?? 'div';

  return (
    <Component className={clsx('sf-grid', `sf-grid--cols-${columns}`, className)} {...rest}>
      {children}
    </Component>
  );
}

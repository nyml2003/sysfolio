import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

import { clsx } from 'clsx';

type SurfaceTone = 'default' | 'muted' | 'accent' | 'danger';

type SurfaceProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  tone?: SurfaceTone;
  padded?: boolean;
  className?: string;
};

export function Surface<T extends ElementType = 'section'>({
  as,
  children,
  tone = 'default',
  padded = true,
  className,
  ...rest
}: SurfaceProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof SurfaceProps<T>>) {
  const Component = as ?? 'section';

  return (
    <Component
      className={clsx(
        'sf-surface',
        `sf-surface--${tone}`,
        padded && 'sf-surface--padded',
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}

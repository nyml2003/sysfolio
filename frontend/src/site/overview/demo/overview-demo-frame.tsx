import type { ReactNode } from 'react';

import { Inline, Stack, Surface } from '@/shared/ui/layout';
import { Tag } from '@/shared/ui/primitives';

import { useOverviewCopy } from '../overview-copy';

export function DemoBulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="overview-demo-list">
      {items.map((text, index) => (
        <li key={index}>{text}</li>
      ))}
    </ul>
  );
}

export function DemoFrame({ title, children }: { title: string; children: ReactNode }) {
  const copy = useOverviewCopy();

  return (
    <Surface className="overview-demo" tone="muted">
      <Stack gap="md">
        <Inline align="between">
          <h3 className="overview-demo__title">{title}</h3>
          <Tag tone="accent">{copy.demos.liveTag}</Tag>
        </Inline>
        {children}
      </Stack>
    </Surface>
  );
}

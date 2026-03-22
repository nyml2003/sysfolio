import { Stack } from '@/shared/ui/layout';

export function TreeNavDemo() {
  return (
    <Stack className="overview-tree-demo" gap="xs">
      <div className="overview-tree-demo__row overview-tree-demo__row--current">Foundation</div>
      <div className="overview-tree-demo__row overview-tree-demo__row--child">StyleProvider</div>
      <div className="overview-tree-demo__row overview-tree-demo__row--child overview-tree-demo__row--selected">
        Token Map
      </div>
      <div className="overview-tree-demo__row">Audit</div>
    </Stack>
  );
}

import { Stack } from "@/shared/ui/layout";

import type { OverviewDemoId } from "../overview-copy";
import { useOverviewCopy } from "../overview-copy";

import { DemoFrame } from "./overview-demo-frame";
import { overviewDemoRenderers } from "./overview-demo-registry";

type OverviewDemoDeckProps = {
  demoIds: string[];
};

export function OverviewDemoDeck({ demoIds }: OverviewDemoDeckProps) {
  const copy = useOverviewCopy();

  if (demoIds.length === 0) {
    return <></>;
  }

  return (
    <Stack className="overview-demo-deck" gap="xl">
      {demoIds.flatMap((demoId) => {
        if (!Object.hasOwn(overviewDemoRenderers, demoId)) {
          return [];
        }

        const render = overviewDemoRenderers[demoId as OverviewDemoId];

        return [
          <DemoFrame key={demoId} title={copy.demos.titleById(demoId as OverviewDemoId)}>
            {render()}
          </DemoFrame>,
        ];
      })}
    </Stack>
  );
}

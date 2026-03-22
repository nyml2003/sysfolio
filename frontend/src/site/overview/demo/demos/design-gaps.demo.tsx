import { listOverviewDesignGaps } from "@/shared/data/mock/content.fixtures";
import { Inline, Stack, Surface } from "@/shared/ui/layout";
import { Tag } from "@/shared/ui/primitives";

export function DesignGapsDemo() {
  const gaps = listOverviewDesignGaps();

  return (
    <Stack gap="sm">
      {gaps.map((gap) => (
        <Surface key={gap.id}>
          <Stack gap="xs">
            <Inline align="between" wrap>
              <strong>{gap.title}</strong>
              <Tag tone="warning">{gap.owner}</Tag>
            </Inline>
            <p className="overview-demo__copy">{gap.description}</p>
          </Stack>
        </Surface>
      ))}
    </Stack>
  );
}

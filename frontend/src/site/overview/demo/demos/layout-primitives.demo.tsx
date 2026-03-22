import { Grid, Inline, Stack, Surface } from "@/shared/ui/layout";
import { Tag } from "@/shared/ui/primitives";

export function LayoutPrimitivesDemo() {
  return (
    <Stack gap="md">
      <Inline wrap>
        <Tag>Stack</Tag>
        <Tag>Inline</Tag>
        <Tag>Grid</Tag>
        <Tag>Surface</Tag>
      </Inline>
      <Grid columns={3}>
        <Surface>Stack controls vertical rhythm.</Surface>
        <Surface>Inline aligns controls and metadata.</Surface>
        <Surface>Grid handles repeatable card layouts.</Surface>
      </Grid>
    </Stack>
  );
}

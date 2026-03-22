import { Grid, Stack } from '@/shared/ui/layout';
import { Notice, ProgressBar } from '@/shared/ui/primitives';

export function ViewStateLayoutDemo() {
  return (
    <Grid columns={3}>
      <Notice title="Loading" tone="info">
        Stable loading surface with calm hierarchy.
      </Notice>
      <Notice title="Empty" tone="warning">
        Empty states need a dedicated tone and action path.
      </Notice>
      <Stack gap="sm">
        <Notice title="Error" tone="danger">
          Error states reuse the same feedback language.
        </Notice>
        <ProgressBar value={64} />
      </Stack>
    </Grid>
  );
}

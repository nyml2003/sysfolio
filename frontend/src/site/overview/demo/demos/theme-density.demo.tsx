import { Grid, Stack, Surface } from '@/shared/ui/layout';
import { Tag } from '@/shared/ui/primitives';

export function ThemeDensityDemo() {
  return (
    <Grid columns={2}>
      <Surface>
        <Stack gap="sm">
          <Tag>Comfortable rhythm</Tag>
          <p className="overview-demo__copy">
            Long-form reading and overview pages use the relaxed scale.
          </p>
        </Stack>
      </Surface>
      <Surface>
        <Stack gap="sm">
          <Tag tone="accent">Compact rhythm</Tag>
          <p className="overview-demo__copy">
            Dense navigation and inventory views tighten spacing without changing structure.
          </p>
        </Stack>
      </Surface>
    </Grid>
  );
}

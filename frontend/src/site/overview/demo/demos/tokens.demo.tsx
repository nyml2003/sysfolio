import { Grid, Surface } from '@/shared/ui/layout';

export function TokensDemo() {
  return (
    <Grid columns={3}>
      <Surface className="overview-token-swatch">
        <div className="overview-token-swatch__chip overview-token-swatch__chip--canvas" />
        <div>Canvas</div>
      </Surface>
      <Surface className="overview-token-swatch">
        <div className="overview-token-swatch__chip overview-token-swatch__chip--surface" />
        <div>Raised surface</div>
      </Surface>
      <Surface className="overview-token-swatch">
        <div className="overview-token-swatch__chip overview-token-swatch__chip--accent" />
        <div>Accent</div>
      </Surface>
    </Grid>
  );
}

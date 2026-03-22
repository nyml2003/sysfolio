import { useStyleContext } from '@/shared/ui/foundation';
import { Grid, Surface } from '@/shared/ui/layout';

export function StyleProviderDemo() {
  const style = useStyleContext();

  return (
    <Grid columns={2}>
      {(['theme', 'density', 'layoutMode', 'motion'] as const).map((key) => (
        <Surface className="overview-runtime-card" key={key}>
          <div className="overview-runtime-card__label">{key}</div>
          <div className="overview-runtime-card__value">{style[key]}</div>
        </Surface>
      ))}
    </Grid>
  );
}

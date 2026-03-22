import { overviewDocumentMetaById } from "@/shared/data/mock/content.fixtures";
import { Grid, Surface } from "@/shared/ui/layout";

export function MissingComponentsDemo() {
  const summaries = Object.values(overviewDocumentMetaById).reduce(
    (current, meta) => ({
      ...current,
      [meta.status]: (current[meta.status] ?? 0) + 1,
    }),
    {} as Record<string, number>,
  );

  return (
    <Grid columns={3}>
      {Object.entries(summaries).map(([status, count]) => (
        <Surface key={status}>
          <div className="overview-runtime-card__label">{status}</div>
          <div className="overview-runtime-card__value">{count}</div>
        </Surface>
      ))}
    </Grid>
  );
}

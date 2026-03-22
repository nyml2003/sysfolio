import type { ReactNode } from "react";

import {
  listOverviewDesignGaps,
  overviewDocumentMetaById,
} from "@/shared/data/mock/content.fixtures";
import { useStyleContext } from "@/shared/ui/foundation";
import { Grid, Inline, Stack, Surface } from "@/shared/ui/layout";
import {
  Button,
  Field,
  FieldRow,
  Notice,
  ProgressBar,
  SegmentedControl,
  SelectInput,
  Tag,
  TextArea,
  TextInput,
} from "@/shared/ui/primitives";
import { some } from "@/shared/lib/monads/option";
import { usePreferences } from "@/shared/store/preferences";

type OverviewDemoDeckProps = {
  demoIds: string[];
};

function DemoFrame({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Surface className="overview-demo" tone="muted">
      <Stack gap="sm">
        <Inline align="between">
          <h3 className="overview-demo__title">{title}</h3>
          <Tag tone="accent">Live</Tag>
        </Inline>
        {children}
      </Stack>
    </Surface>
  );
}

function StyleProviderDemo() {
  const style = useStyleContext();

  return (
    <Grid columns={2}>
      {(["theme", "density", "layoutMode", "motion"] as const).map((key) => (
        <Surface className="overview-runtime-card" key={key}>
          <div className="overview-runtime-card__label">{key}</div>
          <div className="overview-runtime-card__value">{style[key]}</div>
        </Surface>
      ))}
    </Grid>
  );
}

function PreferenceControlsDemo() {
  const { density, setDensity, theme, toggleTheme } = usePreferences();

  return (
    <Stack gap="sm">
      <Inline align="between" wrap>
        <Button onClick={toggleTheme} tone="secondary">
          Toggle theme ({theme})
        </Button>
        <Tag tone="success">Preference-backed</Tag>
      </Inline>
      <SegmentedControl
        label="Density"
        onChange={setDensity}
        options={[
          { value: "comfortable", label: "Comfortable" },
          { value: "medium", label: "Medium" },
          { value: "compact", label: "Compact" },
        ]}
        value={density}
      />
    </Stack>
  );
}

function TokensDemo() {
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

function ThemeDensityDemo() {
  return (
    <Grid columns={2}>
      <Surface>
        <Stack gap="sm">
          <Tag>Comfortable rhythm</Tag>
          <p className="overview-demo__copy">Long-form reading and overview pages use the relaxed scale.</p>
        </Stack>
      </Surface>
      <Surface>
        <Stack gap="sm">
          <Tag tone="accent">Compact rhythm</Tag>
          <p className="overview-demo__copy">Dense navigation and inventory views tighten spacing without changing structure.</p>
        </Stack>
      </Surface>
    </Grid>
  );
}

function LayoutPrimitivesDemo() {
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

function AppShellDemo() {
  const { layoutMode } = useStyleContext();

  return (
    <Surface className="overview-shell-preview" tone="muted">
      <div className="overview-shell-preview__topbar">Topbar</div>
      <div className="overview-shell-preview__body">
        <div className="overview-shell-preview__rail">Navigation</div>
        <div className="overview-shell-preview__main">Reading pane</div>
        <div className="overview-shell-preview__rail">Context</div>
      </div>
      <Inline gap="sm">
        <Tag tone="accent">layout: {layoutMode}</Tag>
        <Tag>filesystem shell</Tag>
      </Inline>
    </Surface>
  );
}

function ButtonDemo() {
  return (
    <Inline wrap>
      <Button tone="primary">Primary</Button>
      <Button tone="secondary">Secondary</Button>
      <Button tone="ghost">Ghost</Button>
    </Inline>
  );
}

function FieldInputDemo() {
  return (
    <FieldRow>
      <Field description={some("Shared calm field surface.")} label="Text input">
        <TextInput defaultValue="Button copy" />
      </Field>
      <Field description={some("Textarea follows the same token family.")} label="Notes">
        <TextArea defaultValue="Design asks should stay visible." rows={4} />
      </Field>
      <Field description={some("Select trigger stays inside the same field system.")} label="Density">
        <SelectInput defaultValue="comfortable">
          <option value="comfortable">Comfortable</option>
          <option value="medium">Medium</option>
          <option value="compact">Compact</option>
        </SelectInput>
      </Field>
    </FieldRow>
  );
}

function TreeNavDemo() {
  return (
    <Stack className="overview-tree-demo" gap="xs">
      <div className="overview-tree-demo__row overview-tree-demo__row--current">Foundation</div>
      <div className="overview-tree-demo__row overview-tree-demo__row--child">StyleProvider</div>
      <div className="overview-tree-demo__row overview-tree-demo__row--child overview-tree-demo__row--selected">Token Map</div>
      <div className="overview-tree-demo__row">Audit</div>
    </Stack>
  );
}

function ViewStateLayoutDemo() {
  return (
    <Grid columns={3}>
      <Notice title="Loading" tone="info">Stable loading surface with calm hierarchy.</Notice>
      <Notice title="Empty" tone="warning">Empty states need a dedicated tone and action path.</Notice>
      <Stack gap="sm">
        <Notice title="Error" tone="danger">Error states reuse the same feedback language.</Notice>
        <ProgressBar value={64} />
      </Stack>
    </Grid>
  );
}

function MissingComponentsDemo() {
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

function DesignGapsDemo() {
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

const demoById: Record<string, { title: string; render: () => ReactNode }> = {
  "style-provider": { title: "Resolved runtime", render: () => <StyleProviderDemo /> },
  preferences: { title: "Preference controls", render: () => <PreferenceControlsDemo /> },
  tokens: { title: "Token swatches", render: () => <TokensDemo /> },
  "theme-density": { title: "Theme and density", render: () => <ThemeDensityDemo /> },
  "layout-primitives": { title: "Layout primitives", render: () => <LayoutPrimitivesDemo /> },
  "app-shell": { title: "Shell preview", render: () => <AppShellDemo /> },
  button: { title: "Button set", render: () => <ButtonDemo /> },
  "field-input": { title: "Field family", render: () => <FieldInputDemo /> },
  "tree-nav": { title: "Tree navigation priority", render: () => <TreeNavDemo /> },
  "view-state-layout": { title: "Lifecycle surfaces", render: () => <ViewStateLayoutDemo /> },
  "missing-components": { title: "Coverage summary", render: () => <MissingComponentsDemo /> },
  "design-gaps": { title: "Design gap backlog", render: () => <DesignGapsDemo /> },
};

export function OverviewDemoDeck({ demoIds }: OverviewDemoDeckProps) {
  if (demoIds.length === 0) {
    return null;
  }

  return (
    <Stack gap="md">
      {demoIds.flatMap((demoId) => {
        const demo = demoById[demoId];

        return demo === undefined
          ? []
          : [
              <DemoFrame key={demoId} title={demo.title}>
                {demo.render()}
              </DemoFrame>,
            ];
      })}
    </Stack>
  );
}

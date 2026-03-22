import { Inline, Stack } from "@/shared/ui/layout";
import { ButtonSecondaryMd, SegmentedControl, Tag } from "@/shared/ui/primitives";
import { usePreferences } from "@/shared/store/preferences";

export function PreferenceControlsDemo() {
  const { density, setDensity, theme, toggleTheme } = usePreferences();

  return (
    <Stack gap="sm">
      <Inline align="between" wrap>
        <ButtonSecondaryMd onClick={toggleTheme}>Toggle theme ({theme})</ButtonSecondaryMd>
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

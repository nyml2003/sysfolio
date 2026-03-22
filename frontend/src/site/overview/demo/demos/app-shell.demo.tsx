import { useStyleContext } from "@/shared/ui/foundation";
import { Inline, Surface } from "@/shared/ui/layout";
import { Tag } from "@/shared/ui/primitives";

export function AppShellDemo() {
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

import "./ContextPanel.module.css";
import "@/shared/ui/primitives/Button.module.css";

import type { RenderableEntryPayload, RepositoryError } from "@/entities/content";
import { none, unwrapOr } from "@/shared/lib/monads/option";
import type { ResourceState } from "@/shared/lib/resource/resource-state";

type ContextPanelProps = {
  resource: ResourceState<RenderableEntryPayload, RepositoryError>;
  activeHeadingId: string;
  onNavigate: (path: string) => void;
  onScrollToHeading: (headingId: string) => void;
};

export function ContextPanel({
  resource,
  activeHeadingId,
  onNavigate,
  onScrollToHeading,
}: ContextPanelProps) {
  if (resource.tag !== "ready") {
    return (
      <aside className="m-context-panel">
        <section className="m-context-panel__section">
          <div className="m-context-panel__title">Context</div>
          <div>上下文信息会在当前内容就绪后出现。</div>
        </section>
      </aside>
    );
  }

  const context = unwrapOr(resource.value.context, {
    breadcrumbs: [],
    parent: none(),
    siblings: [],
    recentEntries: [],
    stats: none(),
  });

  return (
    <aside className="m-context-panel">
      <section className="m-context-panel__section">
        <div className="m-context-panel__title">Location</div>
        <div>{context.breadcrumbs.map((item) => item.title).join(" / ")}</div>
      </section>

      {resource.value.content.kind === "article" ? (
        <section className="m-context-panel__section">
          <div className="m-context-panel__title">Table Of Contents</div>
          <div className="m-toc">
            {resource.value.content.toc.map((item) => (
              <button
                className={[
                  "m-toc__item",
                  item.id === activeHeadingId ? "is-active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={item.id}
                onClick={() => {
                  onScrollToHeading(item.id);
                }}
                type="button"
              >
                {item.title}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {context.stats.tag === "some" ? (
        <section className="m-context-panel__section">
          <div className="m-context-panel__title">Directory Stats</div>
          <div>{context.stats.value.childCount} items</div>
          <div>{context.stats.value.folderCount} folders</div>
          <div>{context.stats.value.articleCount} articles</div>
        </section>
      ) : null}

      {context.parent.tag === "some" ? (
        <section className="m-context-panel__section">
          <div className="m-context-panel__title">Parent</div>
          <button
            className="m-button m-button--secondary"
            onClick={() => {
              onNavigate(context.parent.value.path);
            }}
            type="button"
          >
            返回 {context.parent.value.title}
          </button>
        </section>
      ) : null}

      {context.recentEntries.length > 0 ? (
        <section className="m-context-panel__section">
          <div className="m-context-panel__title">Recent</div>
          {context.recentEntries.map((entry) => (
            <button
              className="m-toc__item"
              key={entry.id}
              onClick={() => {
                onNavigate(entry.path);
              }}
              type="button"
            >
              {entry.title}
            </button>
          ))}
        </section>
      ) : null}
    </aside>
  );
}

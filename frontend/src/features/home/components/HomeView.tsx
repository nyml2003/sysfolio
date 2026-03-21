import "./HomeView.module.css";

import type { ContextInfo, HomeContent } from "@/entities/content";
import { unwrapOr } from "@/shared/lib/monads/option";
import { ArticleIcon, FolderIcon } from "@/shared/ui/primitives/Icon";

type HomeViewProps = {
  content: HomeContent;
  context: ContextInfo;
  onNavigate: (path: string) => void;
};

function renderEntryIcon(kind: string) {
  return kind === "folder" ? <FolderIcon size={16} /> : <ArticleIcon size={16} />;
}

export function HomeView({ content, context, onNavigate }: HomeViewProps) {
  return (
    <section className="m-home-view">
      <div className="m-home-view__hero">
        <div className="m-home-view__eyebrow">sysfolio / home</div>
        <h1 className="m-home-view__title">{content.title}</h1>
        <div className="m-home-view__summary">
          左侧目录负责定位，中栏负责阅读，右栏负责当前上下文。这个首页只做一件事:
          让用户以最低成本进入文件系统式阅读。
        </div>
      </div>

      <section className="m-home-view__section">
        <div className="m-home-view__section-title">Quick Entries</div>
        <div className="m-home-view__list">
          {context.recentEntries.map((entry) => (
            <button
              className={[
                "m-home-view__entry",
                entry.status === "coming_soon" ? "is-coming-soon" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              key={entry.id}
              onClick={() => {
                onNavigate(entry.path);
              }}
              type="button"
            >
              {renderEntryIcon(entry.kind)}
              <div className="m-home-view__entry-body">
                <div className="m-home-view__entry-title">{entry.title}</div>
                <div className="m-home-view__entry-meta">
                  <span>{entry.kind === "folder" ? "目录" : "文章"}</span>
                  {entry.readingMinutes.tag === "some" ? (
                    <span>{entry.readingMinutes.value} min</span>
                  ) : null}
                </div>
                {unwrapOr(entry.description, "") === "" ? null : (
                  <div className="m-home-view__entry-summary">
                    {unwrapOr(entry.description, "")}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}

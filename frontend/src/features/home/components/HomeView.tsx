import type { ContextInfo, HomeContent } from "@/entities/content";
import { unwrapOr } from "@/shared/lib/monads/option";
import { ArticleIcon, FolderIcon } from "@/shared/ui/primitives/Icon";
import styles from "./HomeView.module.css";

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
    <section className={styles.root}>
      <div className={styles.hero}>
        <div className={styles.eyebrow}>sysfolio / home</div>
        <h1 className={styles.title}>{content.title}</h1>
        <div className={styles.summary}>
          左侧目录负责定位，中栏负责阅读，右栏负责当前上下文。这个首页只做一件事:
          让用户以最低成本进入文件系统式阅读。
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionTitle}>Quick Entries</div>
        <div className={styles.list}>
          {context.recentEntries.map((entry) => (
            <button
              className={[styles.entry, entry.status === "coming_soon" ? styles.entryComingSoon : ""]
                .filter(Boolean)
                .join(" ")}
              key={entry.id}
              onClick={() => {
                onNavigate(entry.path);
              }}
              type="button"
            >
              {renderEntryIcon(entry.kind)}
              <div className={styles.entryBody}>
                <div className={styles.entryTitle}>{entry.title}</div>
                <div className={styles.entryMeta}>
                  <span>{entry.kind === "folder" ? "目录" : "文章"}</span>
                  {entry.readingMinutes.tag === "some" ? (
                    <span>{entry.readingMinutes.value} min</span>
                  ) : null}
                </div>
                {unwrapOr(entry.description, "") === "" ? null : (
                  <div className={styles.entrySummary}>
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

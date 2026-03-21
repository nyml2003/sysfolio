import type { ContextInfo, HomeContent } from "@/entities/content";
import { useUiCopy } from "@/shared/lib/i18n/use-ui-copy";
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
  const copy = useUiCopy();

  return (
    <section className={styles.root}>
      <div className={styles.hero}>
        <div className={styles.eyebrow}>{copy.home.eyebrow}</div>
        <h1 className={styles.title}>{content.title}</h1>
        <div className={styles.summary}>{copy.home.summary}</div>
      </div>

      <section className={styles.section}>
        <div className={styles.sectionTitle}>{copy.home.quickEntriesTitle}</div>
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
                  <span>{copy.common.kindLabel(entry.kind)}</span>
                  {entry.readingMinutes.tag === "some" ? (
                    <span>{copy.common.minuteCount(entry.readingMinutes.value)}</span>
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

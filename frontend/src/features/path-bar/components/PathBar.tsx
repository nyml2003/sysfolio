import type { BreadcrumbSegment } from "@/entities/content";

import { ThemeToggle } from "@/features/theme/components/ThemeToggle";
import styles from "./PathBar.module.css";

type PathBarProps = {
  breadcrumbs: BreadcrumbSegment[];
  onNavigate: (path: string) => void;
};

export function PathBar({ breadcrumbs, onNavigate }: PathBarProps) {
  return (
    <header className={styles.root}>
      <nav aria-label="当前路径" className={styles.segments}>
        {breadcrumbs.map((segment, index) => {
          const isCurrent = index === breadcrumbs.length - 1;

          return (
            <div className={styles.segmentGroup} key={segment.id}>
              <button
                className={[styles.segment, isCurrent ? styles.current : ""]
                  .filter(Boolean)
                  .join(" ")}
                disabled={isCurrent}
                onClick={() => {
                  if (!isCurrent) {
                    onNavigate(segment.path);
                  }
                }}
                type="button"
              >
                {segment.title}
              </button>
              {isCurrent ? null : <span className={styles.separator}>/</span>}
            </div>
          );
        })}
      </nav>
      <div className={styles.tools}>
        <ThemeToggle />
      </div>
    </header>
  );
}

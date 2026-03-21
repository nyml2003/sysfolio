import type { BreadcrumbSegment } from "@/entities/content";

import { ThemeToggle } from "@/features/theme/components/ThemeToggle";
import styles from "./PathBar.module.css";

type PathBarProps = {
  breadcrumbs: BreadcrumbSegment[];
  isLoading: boolean;
  onNavigate: (path: string) => void;
};

function getSkeletonWidth(title: string, isCurrent: boolean): string {
  const minimumCharacterCount = isCurrent ? 10 : 6;
  const characterCount = Math.max(title.length, minimumCharacterCount);
  const width = Math.min(156, Math.max(52, characterCount * 8));

  return `${width}px`;
}

export function PathBar({ breadcrumbs, isLoading, onNavigate }: PathBarProps) {
  return (
    <header className={styles.root}>
      <nav
        aria-busy={isLoading}
        aria-label="当前路径"
        className={styles.segments}
      >
        {breadcrumbs.map((segment, index) => {
          const isCurrent = index === breadcrumbs.length - 1;

          return (
            <div className={styles.segmentGroup} key={segment.id}>
              {isLoading ? (
                <span
                  aria-hidden="true"
                  className={[
                    styles.segmentSkeleton,
                    isCurrent ? styles.segmentSkeletonCurrent : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={{ width: getSkeletonWidth(segment.title, isCurrent) }}
                />
              ) : (
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
              )}
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

import "./PathBar.module.css";

import type { BreadcrumbSegment } from "@/entities/content";

import { ThemeToggle } from "@/features/theme/components/ThemeToggle";

type PathBarProps = {
  breadcrumbs: BreadcrumbSegment[];
  onNavigate: (path: string) => void;
};

export function PathBar({ breadcrumbs, onNavigate }: PathBarProps) {
  return (
    <header className="m-path-bar">
      <nav aria-label="当前路径" className="m-path-bar__segments">
        {breadcrumbs.map((segment, index) => {
          const isCurrent = index === breadcrumbs.length - 1;

          return (
            <div className="m-path-bar__segments" key={segment.id}>
              <button
                className={["m-path-segment", isCurrent ? "is-current" : ""]
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
              {isCurrent ? null : (
                <span className="m-path-segment__separator">/</span>
              )}
            </div>
          );
        })}
      </nav>
      <div className="m-path-bar__tools">
        <ThemeToggle />
      </div>
    </header>
  );
}

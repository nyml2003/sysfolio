import type { BreadcrumbSegment } from '@/entities/content';

import { LocaleToggle } from '@/features/locale/components/LocaleToggle';
import { ThemeToggle } from '@/features/theme/components/ThemeToggle';
import { useUiCopy } from '@/shared/lib/i18n/use-ui-copy';
import { useStyleContext } from '@/shared/ui/foundation';
import { ButtonGhostMd } from '@/shared/ui/primitives';
import { ButtonGhostSm } from '@/shared/ui/primitives';

type PathBarProps = {
  breadcrumbs: BreadcrumbSegment[];
  isLoading: boolean;
  onNavigate: (path: string) => void;
  onOpenNavigation: () => void;
  onOpenContext: () => void;
};

function getSkeletonWidth(title: string, isCurrent: boolean): string {
  const minimumCharacterCount = isCurrent ? 10 : 6;
  const characterCount = Math.max(title.length, minimumCharacterCount);
  const width = Math.min(156, Math.max(52, characterCount * 8));

  return `${width}px`;
}

export function PathBar({
  breadcrumbs,
  isLoading,
  onNavigate,
  onOpenNavigation,
  onOpenContext,
}: PathBarProps) {
  const copy = useUiCopy();
  const { layoutMode } = useStyleContext();
  const showNavigationToggle = layoutMode === 'compact';
  const showContextToggle = layoutMode !== 'spacious';

  return (
    <header className="sf-path-bar">
      <nav
        aria-busy={isLoading}
        aria-label={copy.pathBar.navLabel}
        className="sf-path-bar__segments"
      >
        {showNavigationToggle ? (
          <ButtonGhostSm onClick={onOpenNavigation}>{copy.pathBar.filesButton}</ButtonGhostSm>
        ) : null}
        {breadcrumbs.map((segment, index) => {
          const isCurrent = index === breadcrumbs.length - 1;

          return (
            <div className="sf-path-bar__segment-group" key={segment.id}>
              {isLoading ? (
                <span
                  aria-hidden="true"
                  className={['sf-path-bar__segment-skeleton', isCurrent ? 'is-current' : '']
                    .filter(Boolean)
                    .join(' ')}
                  style={{ width: getSkeletonWidth(segment.title, isCurrent) }}
                />
              ) : (
                <ButtonGhostMd
                  aria-current={isCurrent ? 'page' : false}
                  className={['sf-path-bar__segment', isCurrent ? 'is-current' : '']
                    .filter(Boolean)
                    .join(' ')}
                  disabled={isCurrent}
                  onClick={() => {
                    if (!isCurrent) {
                      onNavigate(segment.path);
                    }
                  }}
                >
                  {segment.title}
                </ButtonGhostMd>
              )}
              {isCurrent ? null : <span className="sf-path-bar__separator">/</span>}
            </div>
          );
        })}
      </nav>
      <div className="sf-path-bar__tools">
        {showContextToggle ? (
          <ButtonGhostSm onClick={onOpenContext}>{copy.pathBar.contextButton}</ButtonGhostSm>
        ) : null}
        <LocaleToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}

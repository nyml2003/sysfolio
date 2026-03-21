import { startTransition, useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import type { BreadcrumbSegment } from "@/entities/content";
import { ContentPane } from "@/features/content-pane/components/ContentPane";
import { useRenderableEntry } from "@/features/content-pane/hooks/useRenderableEntry";
import { getTocTargetScrollTop } from "@/features/article/model/toc-activation";
import { ContextPanel } from "@/features/context-panel/components/ContextPanel";
import { FileTree } from "@/features/file-tree/components/FileTree";
import { OnboardingHints } from "@/features/onboarding/components/OnboardingHints";
import { PathBar } from "@/features/path-bar/components/PathBar";
import { useUiCopy } from "@/shared/lib/i18n/use-ui-copy";
import { ROOT_PATH, normalizePath, splitPathSegments } from "@/shared/lib/path/content-path";
import { usePreferences } from "@/shared/store/preferences/PreferencesProvider";
import styles from "./AppShell.module.css";

function buildFallbackBreadcrumbs(path: string, homeTitle: string): BreadcrumbSegment[] {
  const segments = splitPathSegments(path);
  const breadcrumbs: BreadcrumbSegment[] = [
    {
      id: "root",
      title: "sysfolio",
      path: ROOT_PATH,
    },
  ];

  let currentSegments: string[] = [];

  for (const segment of segments) {
    currentSegments = [...currentSegments, segment];
    breadcrumbs.push({
      id: currentSegments.join("/"),
      title: segment,
      path: `/${currentSegments.join("/")}`,
    });
  }

  if (breadcrumbs.length === 1) {
    breadcrumbs.push({
      id: "home",
      title: homeTitle,
      path: ROOT_PATH,
    });
  }

  return breadcrumbs;
}

function ShellRoute() {
  const location = useLocation();
  const navigate = useNavigate();
  const { locale } = usePreferences();
  const copy = useUiCopy();
  const currentPath = normalizePath(location.pathname);
  const resource = useRenderableEntry(currentPath);
  const fallbackBreadcrumbs = buildFallbackBreadcrumbs(currentPath, copy.common.homeTitle);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const [activeHeadingId, setActiveHeadingId] = useState("");

  useEffect(() => {
    startTransition(() => {
      setActiveHeadingId("");
    });
  }, [currentPath, locale]);

  useEffect(() => {
    if (resource.tag === "ready" && resource.value.content.kind === "article") {
      const firstHeadingId = resource.value.content.toc[0]?.id ?? "";

      if (firstHeadingId !== "") {
        startTransition(() => {
          setActiveHeadingId(firstHeadingId);
        });
      }
    }
  }, [resource]);

  const breadcrumbs =
    resource.tag === "ready" && resource.value.context.tag === "some"
      ? resource.value.context.value.breadcrumbs
      : fallbackBreadcrumbs;
  const pathBarLoading = resource.tag === "idle" || resource.tag === "loading";

  return (
    <div className={styles.root}>
      <PathBar
        breadcrumbs={breadcrumbs}
        isLoading={pathBarLoading}
        onNavigate={(path) => {
          void navigate(path);
        }}
      />
      <div className={styles.body}>
        <div className={styles.left}>
          <FileTree
            currentPath={currentPath}
            onNavigate={(path) => {
              void navigate(path);
            }}
          />
        </div>
        <main className={styles.main} ref={scrollContainerRef}>
          <ContentPane
            onActiveHeadingChange={setActiveHeadingId}
            onNavigate={(path) => {
              void navigate(path);
            }}
            path={currentPath}
            resource={resource}
            scrollContainerRef={scrollContainerRef}
          />
        </main>
        <div className={styles.right}>
          <ContextPanel
            activeHeadingId={activeHeadingId}
            onNavigate={(path) => {
              void navigate(path);
            }}
            onScrollToHeading={(headingId) => {
              const scrollContainer = scrollContainerRef.current;

              if (scrollContainer === null) {
                return;
              }

              const heading = scrollContainer.querySelector<HTMLElement>(`#${headingId}`);

              if (heading !== null) {
                scrollContainer.scrollTo({
                  top: getTocTargetScrollTop(scrollContainer, heading),
                  behavior: "smooth",
                });
              }
            }}
            resource={resource}
          />
        </div>
      </div>
      <OnboardingHints />
    </div>
  );
}

export function AppShell() {
  return (
    <Routes>
      <Route element={<ShellRoute />} path="*" />
    </Routes>
  );
}

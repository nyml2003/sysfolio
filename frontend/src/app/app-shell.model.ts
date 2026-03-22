import type { BreadcrumbSegment } from '@/entities/content';
import { ROOT_PATH, splitPathSegments } from '@/shared/lib/path/content-path';

import {
  APP_SHELL_HOME_BREADCRUMB_ID,
  APP_SHELL_ROOT_BREADCRUMB_ID,
  APP_SHELL_ROOT_BREADCRUMB_TITLE,
} from './constant';

export function buildFallbackBreadcrumbs(path: string, homeTitle: string): BreadcrumbSegment[] {
  const segments = splitPathSegments(path);
  const rootBreadcrumb: BreadcrumbSegment = {
    id: APP_SHELL_ROOT_BREADCRUMB_ID,
    title: APP_SHELL_ROOT_BREADCRUMB_TITLE,
    path: ROOT_PATH,
  };
  const resolvedBreadcrumbs = segments.reduce<{
    breadcrumbs: BreadcrumbSegment[];
    currentSegments: string[];
  }>(
    (state, segment) => {
      const currentSegments = [...state.currentSegments, segment];

      return {
        currentSegments,
        breadcrumbs: [
          ...state.breadcrumbs,
          {
            id: currentSegments.join('/'),
            title: segment,
            path: `/${currentSegments.join('/')}`,
          },
        ],
      };
    },
    {
      breadcrumbs: [rootBreadcrumb],
      currentSegments: [],
    }
  );

  return resolvedBreadcrumbs.breadcrumbs.length === 1
    ? [
        ...resolvedBreadcrumbs.breadcrumbs,
        {
          id: APP_SHELL_HOME_BREADCRUMB_ID,
          title: homeTitle,
          path: ROOT_PATH,
        },
      ]
    : resolvedBreadcrumbs.breadcrumbs;
}

import { describe, expect, it } from 'vitest';

import { none, some } from '@/shared/lib/monads/option';

import type { TreeRow } from './tree-row.types';
import {
  getFirstChildRowId,
  getNextRowId,
  getParentRowId,
  getPreviousRowId,
  resolveTypeaheadMatch,
} from './tree-navigation';

const rows: TreeRow[] = [
  {
    node: {
      id: 'home',
      kind: 'home',
      status: 'available',
      title: 'Home',
      slug: '',
      parentId: none(),
      ancestorIds: [],
      pathSegments: [],
      childrenCount: 0,
      hasChildren: false,
      artifactId: none(),
      publishedAt: none(),
      updatedAt: none(),
      readingMinutes: none(),
    },
    depth: 0,
    isExpanded: false,
    isSelected: false,
  },
  {
    node: {
      id: 'foundation',
      kind: 'folder',
      status: 'available',
      title: 'Foundation',
      slug: 'foundation',
      parentId: some('home'),
      ancestorIds: ['home'],
      pathSegments: ['foundation'],
      childrenCount: 2,
      hasChildren: true,
      artifactId: none(),
      publishedAt: none(),
      updatedAt: none(),
      readingMinutes: none(),
    },
    depth: 0,
    isExpanded: true,
    isSelected: false,
  },
  {
    node: {
      id: 'style-provider',
      kind: 'article',
      status: 'available',
      title: 'StyleProvider',
      slug: 'style-provider',
      parentId: some('foundation'),
      ancestorIds: ['home', 'foundation'],
      pathSegments: ['foundation', 'style-provider'],
      childrenCount: 0,
      hasChildren: false,
      artifactId: some('style-provider'),
      publishedAt: none(),
      updatedAt: none(),
      readingMinutes: none(),
    },
    depth: 1,
    isExpanded: false,
    isSelected: true,
  },
  {
    node: {
      id: 'primitives',
      kind: 'folder',
      status: 'available',
      title: 'Primitives',
      slug: 'primitives',
      parentId: some('home'),
      ancestorIds: ['home'],
      pathSegments: ['primitives'],
      childrenCount: 0,
      hasChildren: false,
      artifactId: none(),
      publishedAt: none(),
      updatedAt: none(),
      readingMinutes: none(),
    },
    depth: 0,
    isExpanded: false,
    isSelected: false,
  },
];

describe('tree-navigation', () => {
  it('moves focus up and down through visible rows', () => {
    expect(getNextRowId(rows, 'foundation')).toBe('style-provider');
    expect(getPreviousRowId(rows, 'style-provider')).toBe('foundation');
  });

  it('resolves parent and first child relationships from visible rows', () => {
    expect(getParentRowId(rows, 'style-provider')).toBe('foundation');
    expect(getFirstChildRowId(rows, 'foundation')).toBe('style-provider');
  });

  it('matches rows by typeahead query from the current focus onward', () => {
    expect(resolveTypeaheadMatch(rows, 'pr', 'foundation', 'en-US')).toBe('primitives');
    expect(resolveTypeaheadMatch(rows, 'st', 'foundation', 'en-US')).toBe('style-provider');
  });
});

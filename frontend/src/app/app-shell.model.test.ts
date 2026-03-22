import { describe, expect, it } from 'vitest';

import { buildFallbackBreadcrumbs } from './app-shell.model';

describe('buildFallbackBreadcrumbs', () => {
  it('returns root plus home when path is root', () => {
    const crumbs = buildFallbackBreadcrumbs('/', '首页');

    expect(crumbs).toEqual([
      { id: 'root', title: 'sysfolio', path: '/' },
      { id: 'home', title: '首页', path: '/' },
    ]);
  });

  it('builds nested segments with cumulative paths', () => {
    const crumbs = buildFallbackBreadcrumbs('/a/b', 'Home');

    expect(crumbs).toEqual([
      { id: 'root', title: 'sysfolio', path: '/' },
      { id: 'a', title: 'a', path: '/a' },
      { id: 'a/b', title: 'b', path: '/a/b' },
    ]);
  });
});

import { describe, expect, it } from 'vitest';

import { formatDate } from './format-date';

describe('formatDate', () => {
  it('formats ISO date for zh-CN', () => {
    const s = formatDate('2024-06-01T12:00:00.000Z', 'zh-CN');
    expect(s.length).toBeGreaterThan(0);
    expect(s).toMatch(/2024/);
  });

  it('formats ISO date for en-US', () => {
    const s = formatDate('2024-06-01T12:00:00.000Z', 'en-US');
    expect(s.length).toBeGreaterThan(0);
    expect(s).toMatch(/2024/);
  });
});

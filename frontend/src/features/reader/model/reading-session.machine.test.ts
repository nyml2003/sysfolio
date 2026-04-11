import { describe, expect, it } from 'vitest';

import { isSome } from '@/shared/lib/monads/option';

import {
  createInitialReadingSessionState,
  transitionReadingSession,
} from './reading-session.machine';

describe('reading-session.machine', () => {
  it('models the restore flow from document load to reading', () => {
    let state = createInitialReadingSessionState();

    state = transitionReadingSession(state, { type: 'PATH_CHANGED' });
    expect(state.status).toBe('loading_document');

    state = transitionReadingSession(state, { type: 'DOCUMENT_READY' });
    expect(state.status).toBe('restoring_progress');
    expect(state.readingMode).toBe('restoring');

    state = transitionReadingSession(state, { type: 'RESTORE_RESOLVED', scrollTop: 320 });
    expect(state.status).toBe('positioning');
    expect(state.canRestore).toBe(true);
    expect(state.restoreNoticeVisible).toBe(true);

    state = transitionReadingSession(state, {
      type: 'POSITION_RESOLVED',
      headingId: 'reader-core',
    });
    expect(state.status).toBe('reading');
    expect(state.activeHeadingId).toBe('reader-core');
    expect(state.readingMode).toBe('normal');
  });

  it('keeps persistence failures local and records flush metadata', () => {
    let state = createInitialReadingSessionState();

    state = transitionReadingSession(state, { type: 'PATH_CHANGED' });
    state = transitionReadingSession(state, { type: 'DOCUMENT_READY' });
    state = transitionReadingSession(state, {
      type: 'RESTORE_FAILED',
      error: {
        code: 'storage_error',
        message: 'Restore failed.',
      },
    });
    state = transitionReadingSession(state, {
      type: 'SHORT_CONTENT_DETECTED',
      headingId: 'intro',
    });

    expect(state.status).toBe('short_content');
    expect(isSome(state.restoreError)).toBe(true);
    expect(state.readingMode).toBe('short_content');

    state = transitionReadingSession(state, {
      type: 'PERSIST_FAILED',
      error: {
        code: 'storage_error',
        message: 'Save failed.',
      },
      reason: 'page_hidden',
    });

    expect(isSome(state.saveError)).toBe(true);
    expect(isSome(state.lastFlushReason)).toBe(true);

    if (!isSome(state.lastFlushReason)) {
      throw new Error('Expected a flush reason after persistence failure.');
    }

    expect(state.lastFlushReason.value).toBe('page_hidden');
  });

  it('tracks heading navigation and flushes on completion', () => {
    let state = createInitialReadingSessionState();

    state = transitionReadingSession(state, { type: 'PATH_CHANGED' });
    state = transitionReadingSession(state, { type: 'DOCUMENT_READY' });
    state = transitionReadingSession(state, { type: 'RESTORE_RESOLVED', scrollTop: 0 });
    state = transitionReadingSession(state, { type: 'POSITION_RESOLVED', headingId: 'intro' });
    state = transitionReadingSession(state, {
      type: 'TOC_ITEM_SELECTED',
      headingId: 'query-layer',
    });

    expect(state.status).toBe('navigating_to_heading');
    expect(state.isProgrammaticScrolling).toBe(true);

    state = transitionReadingSession(state, {
      type: 'PROGRAM_SCROLL_COMPLETED',
      headingId: 'query-layer',
    });
    state = transitionReadingSession(state, {
      type: 'PERSIST_SUCCEEDED',
      progress: {
        scrollTop: 480,
        updatedAt: '2026-04-11T00:00:00.000Z',
      },
      reason: 'program_scroll_completed',
    });

    expect(state.status).toBe('reading');
    expect(state.activeHeadingId).toBe('query-layer');
    expect(state.isProgrammaticScrolling).toBe(false);
    expect(isSome(state.lastSavedPosition)).toBe(true);

    if (!isSome(state.lastSavedPosition)) {
      throw new Error('Expected a saved reading position.');
    }

    expect(state.lastSavedPosition.value.scrollTop).toBe(480);
  });
});

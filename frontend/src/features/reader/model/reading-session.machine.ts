import { none, some } from '@/shared/lib/monads/option';

import type { ReadingSessionEvent, ReadingSessionState } from './reading-session.types';

const EMPTY_ACTIVE_HEADING_ID = '';

export function createInitialReadingSessionState(): ReadingSessionState {
  return {
    status: 'booting',
    activeHeadingId: EMPTY_ACTIVE_HEADING_ID,
    restoreNoticeVisible: false,
    canRestore: false,
    lastSavedPosition: none(),
    isProgrammaticScrolling: false,
    readingMode: 'normal',
    saveError: none(),
    restoreError: none(),
    lastFlushReason: none(),
  };
}

export function transitionReadingSession(
  state: ReadingSessionState,
  event: ReadingSessionEvent
): ReadingSessionState {
  switch (event.type) {
    case 'PATH_CHANGED':
      return {
        ...createInitialReadingSessionState(),
        status: 'loading_document',
      };

    case 'DOCUMENT_READY':
      return {
        ...state,
        status: 'restoring_progress',
        readingMode: 'restoring',
        activeHeadingId: EMPTY_ACTIVE_HEADING_ID,
        restoreNoticeVisible: false,
        canRestore: false,
        isProgrammaticScrolling: false,
        restoreError: none(),
      };

    case 'DOCUMENT_FAILED':
      return {
        ...state,
        status: 'error',
        readingMode: 'normal',
        isProgrammaticScrolling: false,
        restoreError: some(event.error),
      };

    case 'RESTORE_RESOLVED':
      return {
        ...state,
        status: 'positioning',
        readingMode: event.scrollTop > 0 ? 'restoring' : 'normal',
        restoreNoticeVisible: event.scrollTop > 0,
        canRestore: event.scrollTop > 0,
        restoreError: none(),
      };

    case 'RESTORE_FAILED':
      return {
        ...state,
        status: 'positioning',
        readingMode: 'normal',
        restoreNoticeVisible: false,
        canRestore: false,
        restoreError: some(event.error),
      };

    case 'POSITION_RESOLVED':
      return {
        ...state,
        status: 'reading',
        activeHeadingId: event.headingId,
        isProgrammaticScrolling: false,
        readingMode: 'normal',
      };

    case 'SHORT_CONTENT_DETECTED':
      return {
        ...state,
        status: 'short_content',
        activeHeadingId: event.headingId,
        isProgrammaticScrolling: false,
        readingMode: 'short_content',
      };

    case 'USER_SCROLLED':
      return {
        ...state,
        status: state.status === 'short_content' ? 'short_content' : 'reading',
        activeHeadingId: event.headingId,
        isProgrammaticScrolling: false,
        readingMode: state.status === 'short_content' ? 'short_content' : 'normal',
      };

    case 'TOC_ITEM_SELECTED':
      return {
        ...state,
        status: 'navigating_to_heading',
        activeHeadingId: event.headingId,
        isProgrammaticScrolling: true,
        readingMode: 'normal',
      };

    case 'PROGRAM_SCROLL_COMPLETED':
      return {
        ...state,
        status: 'reading',
        activeHeadingId: event.headingId,
        isProgrammaticScrolling: false,
        readingMode: 'normal',
      };

    case 'PROGRAM_SCROLL_INTERRUPTED':
      return {
        ...state,
        status: 'reading',
        activeHeadingId: event.headingId,
        isProgrammaticScrolling: false,
        readingMode: 'normal',
      };

    case 'RESTORE_NOTICE_DISMISSED':
      return {
        ...state,
        restoreNoticeVisible: false,
      };

    case 'PERSIST_SUCCEEDED':
      return {
        ...state,
        lastSavedPosition: some(event.progress),
        saveError: none(),
        lastFlushReason: some(event.reason),
      };

    case 'PERSIST_FAILED':
      return {
        ...state,
        saveError: some(event.error),
        lastFlushReason: some(event.reason),
      };

    default:
      return state;
  }
}

import type { ReadingProgress, RepositoryError } from '@/entities/content';
import type { Option } from '@/shared/lib/monads/option';

export type ReadingSessionStatus =
  | 'booting'
  | 'loading_document'
  | 'restoring_progress'
  | 'positioning'
  | 'reading'
  | 'navigating_to_heading'
  | 'short_content'
  | 'error';

export type ReadingMode = 'normal' | 'short_content' | 'restoring';

export type PersistenceFlushReason =
  | 'path_change'
  | 'page_hidden'
  | 'unload'
  | 'program_scroll_completed'
  | 'scroll_idle'
  | 'scroll_to_top';

export type ReadingSessionState = {
  status: ReadingSessionStatus;
  activeHeadingId: string;
  restoreNoticeVisible: boolean;
  canRestore: boolean;
  lastSavedPosition: Option<ReadingProgress>;
  isProgrammaticScrolling: boolean;
  readingMode: ReadingMode;
  saveError: Option<RepositoryError>;
  restoreError: Option<RepositoryError>;
  lastFlushReason: Option<PersistenceFlushReason>;
};

export type ReadingSessionEvent =
  | { type: 'PATH_CHANGED' }
  | { type: 'DOCUMENT_READY' }
  | { type: 'DOCUMENT_FAILED'; error: RepositoryError }
  | { type: 'RESTORE_RESOLVED'; scrollTop: number }
  | { type: 'RESTORE_FAILED'; error: RepositoryError }
  | { type: 'POSITION_RESOLVED'; headingId: string }
  | { type: 'SHORT_CONTENT_DETECTED'; headingId: string }
  | { type: 'USER_SCROLLED'; headingId: string }
  | { type: 'TOC_ITEM_SELECTED'; headingId: string }
  | { type: 'PROGRAM_SCROLL_COMPLETED'; headingId: string }
  | { type: 'PROGRAM_SCROLL_INTERRUPTED'; headingId: string }
  | { type: 'RESTORE_NOTICE_DISMISSED' }
  | { type: 'PERSIST_SUCCEEDED'; progress: ReadingProgress; reason: PersistenceFlushReason }
  | { type: 'PERSIST_FAILED'; error: RepositoryError; reason: PersistenceFlushReason };

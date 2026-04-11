import { startTransition, useEffect, useEffectEvent, useReducer, useRef } from 'react';

import type { ArticleDocument, ReadingProgress } from '@/entities/content';
import { useArticleDom } from '@/features/article/context/article-dom.context';
import {
  ARTICLE_SCROLL_POSITION_EPSILON,
  TOC_ACTIVATION_LINE_RATIO,
  TOC_NAVIGATING_TIMEOUT_MS,
  TOC_READING_PROGRESS_DEBOUNCE_MS,
  TOC_USER_SCROLL_IDLE_MS,
} from '@/features/article/constant';
import { useHeadingActivationObserver } from '@/features/article/hooks/useHeadingActivationObserver';
import { useHeadingLayout } from '@/features/article/hooks/useHeadingLayout';
import { useSmoothScroll } from '@/features/article/hooks/useSmoothScroll';
import { useContentRepository } from '@/shared/data/repository';
import { detachPromise } from '@/shared/lib/async/detach-promise';
import { cancelScheduledAnimationFrame } from '@/shared/lib/dom/cancel-scheduled-animation-frame';
import { clearScheduledTimeout } from '@/shared/lib/dom/clear-scheduled-timeout';
import { getDocumentOption } from '@/shared/lib/dom/get-document-option';
import { getPerformanceNow } from '@/shared/lib/dom/get-performance-now';
import { getWindowOption } from '@/shared/lib/dom/get-window-option';
import { scheduleAnimationFrame } from '@/shared/lib/dom/schedule-animation-frame';
import { scheduleTimeout } from '@/shared/lib/dom/schedule-timeout';
import { getElementScrollTop, setElementScrollTop } from '@/shared/lib/dom/scroll-element';
import { useEventListener } from '@/shared/lib/dom/useEventListener';
import { isSome, none, some, unwrapOr, type Option } from '@/shared/lib/monads/option';

import {
  createInitialReadingSessionState,
  transitionReadingSession,
} from '../model/reading-session.machine';
import type { PersistenceFlushReason, ReadingSessionState } from '../model/reading-session.types';

type UseReaderReadingSessionOptions = {
  path: string;
  document: Option<ArticleDocument>;
  artifactIdentity: Option<string>;
};

type UseReaderReadingSessionResult = {
  state: ReadingSessionState;
  scrollToHeading: (headingId: string) => void;
  scrollToTop: () => void;
};

const EMPTY_ACTIVE_HEADING_ID = '';

export function useReaderReadingSession({
  path,
  document,
  artifactIdentity,
}: UseReaderReadingSessionOptions): UseReaderReadingSessionResult {
  const { scrollContainer } = useArticleDom();
  const repository = useContentRepository();
  const [state, dispatch] = useReducer(
    transitionReadingSession,
    undefined,
    createInitialReadingSessionState
  );
  const observedActiveHeadingIdRef = useRef<Option<string>>(none());
  const bottomVisibleRef = useRef(false);
  const saveTimeoutIdRef = useRef(0);
  const navigatingTimeoutIdRef = useRef(0);
  const userScrollWatchFrameIdRef = useRef(0);
  const lastObservedScrollTopRef = useRef(0);
  const lastObservedScrollChangeAtRef = useRef(0);

  const layout = useHeadingLayout({
    enabled: isSome(document),
  });

  const dispatchTransition = useEffectEvent(
    (event: Parameters<typeof transitionReadingSession>[1]) => {
      startTransition(() => {
        dispatch(event);
      });
    }
  );

  const clearSaveTimeout = useEffectEvent(() => {
    clearScheduledTimeout(saveTimeoutIdRef.current);
    saveTimeoutIdRef.current = 0;
  });

  const clearNavigatingTimeout = useEffectEvent(() => {
    clearScheduledTimeout(navigatingTimeoutIdRef.current);
    navigatingTimeoutIdRef.current = 0;
  });

  const stopUserScrollWatch = useEffectEvent(() => {
    cancelScheduledAnimationFrame(userScrollWatchFrameIdRef.current);
    userScrollWatchFrameIdRef.current = 0;
  });

  const clearPendingWork = useEffectEvent(() => {
    clearSaveTimeout();
    clearNavigatingTimeout();
    stopUserScrollWatch();
  });

  const getResolvedHeadingId = useEffectEvent(() => {
    if (isSome(observedActiveHeadingIdRef.current)) {
      return observedActiveHeadingIdRef.current;
    }

    const currentHeadingId = layout.getHeadingIdForCurrentScrollPosition();

    return isSome(currentHeadingId) ? currentHeadingId : layout.getFirstHeadingId();
  });

  const toReadingProgress = useEffectEvent((scrollTop: number): ReadingProgress => {
    return {
      scrollTop,
      updatedAt: new Date().toISOString(),
    };
  });

  const persistReadingProgress = useEffectEvent(
    async (reason: PersistenceFlushReason, scrollTop: number) => {
      if (!isSome(artifactIdentity)) {
        return;
      }

      try {
        const progress = toReadingProgress(scrollTop);
        const result = await repository.saveReadingProgress(artifactIdentity.value, progress);

        if (result.tag === 'error') {
          dispatchTransition({
            type: 'PERSIST_FAILED',
            error: result.error,
            reason,
          });
          return;
        }

        dispatchTransition({
          type: 'PERSIST_SUCCEEDED',
          progress,
          reason,
        });
      } catch (error) {
        dispatchTransition({
          type: 'PERSIST_FAILED',
          error: {
            code: 'unknown',
            message: `Unexpected reading progress persistence failure: ${String(error)}`,
          },
          reason,
        });
      }
    }
  );

  const flushReadingProgress = useEffectEvent((reason: PersistenceFlushReason) => {
    if (!isSome(scrollContainer)) {
      return;
    }

    clearSaveTimeout();
    detachPromise(persistReadingProgress(reason, getElementScrollTop(scrollContainer.value)));
  });

  const scheduleReadingProgressSave = useEffectEvent(() => {
    clearSaveTimeout();
    saveTimeoutIdRef.current = scheduleTimeout(() => {
      saveTimeoutIdRef.current = 0;

      if (!isSome(scrollContainer)) {
        return;
      }

      detachPromise(
        persistReadingProgress('scroll_idle', getElementScrollTop(scrollContainer.value))
      );
    }, TOC_READING_PROGRESS_DEBOUNCE_MS);
  });

  const syncReadingHeading = useEffectEvent(() => {
    const lastHeadingId = layout.getLastHeadingId();

    if (bottomVisibleRef.current && isSome(lastHeadingId)) {
      dispatchTransition({
        type: 'USER_SCROLLED',
        headingId: lastHeadingId.value,
      });
      return;
    }

    dispatchTransition({
      type: 'USER_SCROLLED',
      headingId: unwrapOr(getResolvedHeadingId(), EMPTY_ACTIVE_HEADING_ID),
    });
  });

  const {
    cancel: cancelSmoothScroll,
    isProgrammaticScrolling,
    scrollTo: smoothScrollTo,
  } = useSmoothScroll({
    durationSeconds: none(),
    onComplete: some((scrollTop) => {
      clearNavigatingTimeout();
      const resolvedHeadingId = unwrapOr(getResolvedHeadingId(), state.activeHeadingId);

      dispatchTransition({
        type: 'PROGRAM_SCROLL_COMPLETED',
        headingId: resolvedHeadingId,
      });
      detachPromise(persistReadingProgress('program_scroll_completed', scrollTop));
    }),
    onUserInteraction: some(() => {
      if (!isSome(document) || !layout.hasScrollableContent() || !isSome(scrollContainer)) {
        return;
      }

      clearSaveTimeout();
      clearNavigatingTimeout();

      if (state.status === 'navigating_to_heading' || isProgrammaticScrolling) {
        dispatchTransition({
          type: 'PROGRAM_SCROLL_INTERRUPTED',
          headingId: unwrapOr(getResolvedHeadingId(), EMPTY_ACTIVE_HEADING_ID),
        });
      }

      lastObservedScrollTopRef.current = getElementScrollTop(scrollContainer.value);
      lastObservedScrollChangeAtRef.current = getPerformanceNow();

      if (userScrollWatchFrameIdRef.current !== 0) {
        return;
      }

      const watchUserScroll = () => {
        if (!isSome(scrollContainer)) {
          stopUserScrollWatch();
          return;
        }

        const currentScrollTop = getElementScrollTop(scrollContainer.value);

        if (
          Math.abs(currentScrollTop - lastObservedScrollTopRef.current) >
          ARTICLE_SCROLL_POSITION_EPSILON
        ) {
          lastObservedScrollTopRef.current = currentScrollTop;
          lastObservedScrollChangeAtRef.current = getPerformanceNow();
          syncReadingHeading();
        }

        if (
          getPerformanceNow() - lastObservedScrollChangeAtRef.current >=
          TOC_USER_SCROLL_IDLE_MS
        ) {
          stopUserScrollWatch();
          scheduleReadingProgressSave();
          return;
        }

        userScrollWatchFrameIdRef.current = scheduleAnimationFrame(watchUserScroll);
      };

      userScrollWatchFrameIdRef.current = scheduleAnimationFrame(watchUserScroll);
    }),
  });

  const scheduleNavigatingTimeout = useEffectEvent(() => {
    clearNavigatingTimeout();
    navigatingTimeoutIdRef.current = scheduleTimeout(() => {
      navigatingTimeoutIdRef.current = 0;
      cancelSmoothScroll();
      syncReadingHeading();
    }, TOC_NAVIGATING_TIMEOUT_MS);
  });

  const applyEntryState = useEffectEvent((requestedScrollTop: number) => {
    if (!isSome(document) || !isSome(scrollContainer)) {
      return;
    }

    const scrollContainerElement = scrollContainer.value;

    layout.refreshLayout();

    const firstHeadingId = layout.getFirstHeadingId();

    if (!isSome(firstHeadingId)) {
      dispatchTransition({
        type: 'POSITION_RESOLVED',
        headingId: EMPTY_ACTIVE_HEADING_ID,
      });
      return;
    }

    if (!layout.hasScrollableContent()) {
      setElementScrollTop(scrollContainerElement, 0);
      observedActiveHeadingIdRef.current = firstHeadingId;
      dispatchTransition({
        type: 'SHORT_CONTENT_DETECTED',
        headingId: firstHeadingId.value,
      });
      return;
    }

    if (requestedScrollTop > 0) {
      setElementScrollTop(scrollContainerElement, requestedScrollTop);
      const restoredHeadingId = layout.getHeadingIdForCurrentScrollPosition();

      observedActiveHeadingIdRef.current = restoredHeadingId;
      dispatchTransition({
        type: 'POSITION_RESOLVED',
        headingId: unwrapOr(restoredHeadingId, firstHeadingId.value),
      });
      return;
    }

    observedActiveHeadingIdRef.current = firstHeadingId;
    dispatchTransition({
      type: 'POSITION_RESOLVED',
      headingId: firstHeadingId.value,
    });
  });

  useHeadingActivationObserver({
    activationLineRatio: TOC_ACTIVATION_LINE_RATIO,
    disabled: !isSome(document) || state.status !== 'reading' || isProgrammaticScrolling,
    layoutVersion: layout.layoutVersion,
    onActiveHeadingChange: (headingId) => {
      observedActiveHeadingIdRef.current = some(headingId);

      if (bottomVisibleRef.current) {
        return;
      }

      dispatchTransition({
        type: 'USER_SCROLLED',
        headingId,
      });
    },
    onBottomVisibilityChange: (visible) => {
      bottomVisibleRef.current = visible;

      if (state.status !== 'reading') {
        return;
      }

      if (visible) {
        const lastHeadingId = layout.getLastHeadingId();

        if (isSome(lastHeadingId)) {
          dispatchTransition({
            type: 'USER_SCROLLED',
            headingId: lastHeadingId.value,
          });
        }

        return;
      }

      syncReadingHeading();
    },
  });

  const handleScrollToHeading = useEffectEvent((headingId: string) => {
    if (!isSome(document) || !isSome(scrollContainer)) {
      return;
    }

    const scrollContainerElement = scrollContainer.value;

    layout.refreshLayout();

    const firstHeadingId = layout.getFirstHeadingId();
    const heading = layout.getHeadingById(headingId);

    if (!isSome(firstHeadingId) || !isSome(heading)) {
      return;
    }

    if (!layout.hasScrollableContent() || state.status === 'short_content') {
      const targetScrollTop = layout.getHeadingTargetScrollTop(headingId);

      setElementScrollTop(scrollContainerElement, targetScrollTop);
      observedActiveHeadingIdRef.current = firstHeadingId;
      dispatchTransition({
        type: 'SHORT_CONTENT_DETECTED',
        headingId: firstHeadingId.value,
      });
      detachPromise(persistReadingProgress('program_scroll_completed', targetScrollTop));
      return;
    }

    observedActiveHeadingIdRef.current = none();
    bottomVisibleRef.current = false;
    dispatchTransition({
      type: 'TOC_ITEM_SELECTED',
      headingId,
    });
    scheduleNavigatingTimeout();
    smoothScrollTo(layout.getHeadingTargetScrollTop(headingId));
  });

  const handleScrollToTop = useEffectEvent(() => {
    if (!isSome(document) || !isSome(scrollContainer)) {
      return;
    }

    const scrollContainerElement = scrollContainer.value;

    layout.refreshLayout();

    const firstHeadingId = layout.getFirstHeadingId();

    if (!isSome(firstHeadingId)) {
      return;
    }

    dispatchTransition({
      type: 'RESTORE_NOTICE_DISMISSED',
    });

    if (!layout.hasScrollableContent()) {
      setElementScrollTop(scrollContainerElement, 0);
      observedActiveHeadingIdRef.current = firstHeadingId;
      dispatchTransition({
        type: 'SHORT_CONTENT_DETECTED',
        headingId: firstHeadingId.value,
      });
      detachPromise(persistReadingProgress('scroll_to_top', 0));
      return;
    }

    observedActiveHeadingIdRef.current = none();
    bottomVisibleRef.current = false;
    dispatchTransition({
      type: 'TOC_ITEM_SELECTED',
      headingId: firstHeadingId.value,
    });
    scheduleNavigatingTimeout();
    smoothScrollTo(0);
  });

  useEffect(() => {
    const abortController = new AbortController();
    const frameState = { current: 0 };

    dispatchTransition({
      type: 'PATH_CHANGED',
    });

    if (!isSome(document) || !isSome(artifactIdentity)) {
      clearPendingWork();
      cancelSmoothScroll();
      observedActiveHeadingIdRef.current = none();
      bottomVisibleRef.current = false;
      return undefined;
    }

    dispatchTransition({
      type: 'DOCUMENT_READY',
    });

    const scheduleApplyEntryState = (requestedScrollTop: number) => {
      frameState.current = scheduleAnimationFrame(() => {
        if (abortController.signal.aborted) {
          return;
        }

        applyEntryState(requestedScrollTop);
      });
    };

    const restoreReadingProgress = async () => {
      try {
        const progressResource = await repository.getSavedReadingProgress(artifactIdentity.value);

        if (abortController.signal.aborted) {
          return;
        }

        if (progressResource.tag === 'error') {
          dispatchTransition({
            type: 'RESTORE_FAILED',
            error: progressResource.error,
          });
          scheduleApplyEntryState(0);
          return;
        }

        const restoredScrollTop =
          progressResource.tag === 'ready' &&
          isSome(progressResource.value) &&
          progressResource.value.value.scrollTop > 0
            ? progressResource.value.value.scrollTop
            : 0;

        dispatchTransition({
          type: 'RESTORE_RESOLVED',
          scrollTop: restoredScrollTop,
        });
        scheduleApplyEntryState(restoredScrollTop);
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }

        dispatchTransition({
          type: 'RESTORE_FAILED',
          error: {
            code: 'unknown',
            message: `Unexpected reading progress restore failure: ${String(error)}`,
          },
        });
        scheduleApplyEntryState(0);
      }
    };

    detachPromise(restoreReadingProgress());

    return () => {
      abortController.abort();
      cancelScheduledAnimationFrame(frameState.current);
      cancelSmoothScroll();

      if (isSome(scrollContainer)) {
        clearSaveTimeout();
        detachPromise(
          persistReadingProgress('path_change', getElementScrollTop(scrollContainer.value))
        );
      }

      clearPendingWork();
      observedActiveHeadingIdRef.current = none();
      bottomVisibleRef.current = false;
    };
  }, [
    applyEntryState,
    cancelSmoothScroll,
    clearPendingWork,
    clearSaveTimeout,
    dispatchTransition,
    document,
    artifactIdentity,
    path,
    persistReadingProgress,
    repository,
    scrollContainer,
  ]);

  useEventListener({
    target: getDocumentOption(),
    type: 'visibilitychange',
    listener: () => {
      if (globalThis.document?.visibilityState === 'hidden') {
        flushReadingProgress('page_hidden');
      }
    },
    options: undefined,
    disabled: !isSome(artifactIdentity),
  });

  useEventListener({
    target: getWindowOption(),
    type: 'beforeunload',
    listener: () => {
      flushReadingProgress('unload');
    },
    options: undefined,
    disabled: !isSome(artifactIdentity),
  });

  return {
    state: {
      ...state,
      isProgrammaticScrolling,
    },
    scrollToHeading: handleScrollToHeading,
    scrollToTop: handleScrollToTop,
  };
}

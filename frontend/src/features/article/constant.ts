export const ARTICLE_EMPTY_ACTIVE_HEADING_ID = "";
export const ARTICLE_SCROLL_POSITION_EPSILON = 0.5;
export const ARTICLE_SMOOTH_SCROLL_DURATION_SECONDS = 0.38;
export const ARTICLE_SMOOTH_SCROLL_COMPLETION_EPSILON = 1;
export const ARTICLE_SMOOTH_SCROLL_EASE = [0.22, 1, 0.36, 1] as const;
export const ARTICLE_SCROLL_KEYBOARD_KEYS = [
  "ArrowDown",
  "ArrowUp",
  "PageDown",
  "PageUp",
  "Home",
  "End",
  " ",
] as const;

export const TOC_ACTIVATION_LINE_RATIO = 0.28;
export const TOC_BOTTOM_EPSILON = 4;
export const TOC_BOTTOM_SENTINEL_THRESHOLD = 1;
export const TOC_OBSERVER_BAND_HEIGHT = 4;
export const TOC_HEADING_OBSERVER_THRESHOLD = 0;
export const TOC_SCROLLABLE_EPSILON = 6;
export const TOC_TARGET_EPSILON = 6;
export const TOC_READING_PROGRESS_DEBOUNCE_MS = 180;
export const TOC_USER_SCROLL_IDLE_MS = 140;
export const TOC_NAVIGATING_TIMEOUT_MS = 2_000;

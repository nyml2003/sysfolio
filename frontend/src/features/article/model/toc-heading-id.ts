import { none, some, type Option } from "@/shared/lib/monads/option";

const warnedHeadingElements = new WeakSet<HTMLElement>();

export function getTocHeadingId(heading: HTMLElement): Option<string> {
  const rawHeadingId = heading.dataset.tocId?.trim();

  if (rawHeadingId === undefined || rawHeadingId === "") {
    if (!warnedHeadingElements.has(heading)) {
      warnedHeadingElements.add(heading);
      console.warn("[toc] Skipping heading without a valid data-toc-id.", heading);
    }

    return none();
  }

  return some(rawHeadingId);
}

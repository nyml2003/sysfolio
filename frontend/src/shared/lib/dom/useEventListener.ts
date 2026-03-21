import { useEffect, useRef } from "react";

import { isSome, type Option } from "@/shared/lib/monads/option";

type EventTargetLike = {
  addEventListener: (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions | boolean,
  ) => void;
  removeEventListener: (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: EventListenerOptions | boolean,
  ) => void;
};

type UseEventListenerOptions = {
  target: Option<EventTargetLike>;
  type: string;
  listener: (event: Event) => void;
  options: AddEventListenerOptions | boolean | undefined;
  disabled: boolean;
};

export function useEventListener({
  target,
  type,
  listener,
  options,
  disabled,
}: UseEventListenerOptions) {
  const listenerRef = useRef(listener);

  listenerRef.current = listener;

  useEffect(() => {
    if (disabled || !isSome(target)) {
      return undefined;
    }

    const eventTarget = target.value;
    const handleEvent: EventListener = (event) => {
      listenerRef.current(event);
    };

    eventTarget.addEventListener(type, handleEvent, options);

    return () => {
      eventTarget.removeEventListener(type, handleEvent, options);
    };
  }, [disabled, options, target, type]);
}

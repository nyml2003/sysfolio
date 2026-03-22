import { createElement, forwardRef } from "react";

import { clsx } from "clsx";

import { isSome } from "@/shared/lib/monads/option";

import type { HeadingLevel, HeadingProps } from "./heading.types";

const headingTagByLevel: Record<HeadingLevel, "h1" | "h2" | "h3" | "h4" | "h5" | "h6"> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(props, ref) {
  const {
    level,
    variant,
    tone,
    leadingIcon,
    trailingMeta,
    children,
    className,
    ...rest
  } = props;

  const tag = headingTagByLevel[level];
  const hasAffix = isSome(leadingIcon) || isSome(trailingMeta);

  const inner = hasAffix ? (
    <>
      {isSome(leadingIcon) ? (
        <span aria-hidden className="sf-heading__leading">
          {leadingIcon.value}
        </span>
      ) : (
        false
      )}
      <span className="sf-heading__text">{children}</span>
      {isSome(trailingMeta) ? (
        <span className="sf-heading__trailing">{trailingMeta.value}</span>
      ) : (
        false
      )}
    </>
  ) : (
    children
  );

  return createElement(
    tag,
    {
      ref,
      ...rest,
      className: clsx(
        "sf-heading",
        `sf-heading--${variant}`,
        `sf-heading--${tone}`,
        hasAffix && "sf-heading--has-affix",
        className,
      ),
    },
    inner,
  );
});

Heading.displayName = "Heading";

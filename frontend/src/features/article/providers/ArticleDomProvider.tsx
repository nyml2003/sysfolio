import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  isSome,
  none,
  some,
  type Option,
} from "@/shared/lib/monads/option";

import {
  ArticleDomContext,
  type ArticleDomContextValue,
  type RegisteredArticleHeading,
} from "../context/article-dom.context";

type ArticleDomProviderProps = {
  children: ReactNode;
};

function areSameHeadingOrder(
  currentHeadingOrder: ReadonlyArray<string>,
  nextHeadingOrder: ReadonlyArray<string>,
): boolean {
  return (
    currentHeadingOrder.length === nextHeadingOrder.length &&
    currentHeadingOrder.every((headingId, index) => headingId === nextHeadingOrder[index])
  );
}

function createAllowedHeadingIds(headingOrder: ReadonlyArray<string>): Record<string, true> {
  return headingOrder.reduce<Record<string, true>>(
    (currentIds, headingId) => ({
      ...currentIds,
      [headingId]: true,
    }),
    {},
  );
}

function filterHeadingElementsByAllowedIds(
  headingElementsById: Record<string, HTMLElement>,
  allowedHeadingIds: Record<string, true>,
): Record<string, HTMLElement> {
  return Object.fromEntries(
    Object.entries(headingElementsById).filter(
      ([headingId]) => allowedHeadingIds[headingId] === true,
    ),
  ) as Record<string, HTMLElement>;
}

function toStableNodeOption(
  currentNode: Option<HTMLElement>,
  nextNode: Option<HTMLElement>,
): Option<HTMLElement> {
  if (!isSome(nextNode)) {
    return isSome(currentNode) ? none() : currentNode;
  }

  if (isSome(currentNode) && currentNode.value === nextNode.value) {
    return currentNode;
  }

  return some(nextNode.value);
}

export function ArticleDomProvider({ children }: ArticleDomProviderProps) {
  const [scrollContainer, setScrollContainer] = useState<Option<HTMLElement>>(none());
  const [articleBody, setArticleBody] = useState<Option<HTMLElement>>(none());
  const [bottomSentinel, setBottomSentinel] = useState<Option<HTMLElement>>(none());
  const [headingOrder, setHeadingOrder] = useState<ReadonlyArray<string>>([]);
  const [headingElementsById, setHeadingElementsById] = useState<Record<string, HTMLElement>>({});

  const registerScrollContainer = useCallback((node: Option<HTMLElement>) => {
    setScrollContainer((currentNode) => toStableNodeOption(currentNode, node));
  }, []);

  const registerArticleBody = useCallback((node: Option<HTMLElement>) => {
    setArticleBody((currentNode) => toStableNodeOption(currentNode, node));
  }, []);

  const registerBottomSentinel = useCallback((node: Option<HTMLElement>) => {
    setBottomSentinel((currentNode) => toStableNodeOption(currentNode, node));
  }, []);

  const registerHeadingOrder = useCallback((nextHeadingOrder: ReadonlyArray<string>) => {
    setHeadingOrder((currentHeadingOrder) =>
      areSameHeadingOrder(currentHeadingOrder, nextHeadingOrder)
        ? currentHeadingOrder
        : [...nextHeadingOrder],
    );

    const allowedHeadingIds = createAllowedHeadingIds(nextHeadingOrder);

    setHeadingElementsById((currentHeadingElementsById) => {
      const nextHeadingElementsById = filterHeadingElementsByAllowedIds(
        currentHeadingElementsById,
        allowedHeadingIds,
      );

      return Object.keys(nextHeadingElementsById).length ===
        Object.keys(currentHeadingElementsById).length
        ? currentHeadingElementsById
        : nextHeadingElementsById;
    });
  }, []);

  const registerHeading = useCallback((headingId: string, node: Option<HTMLElement>) => {
    if (headingId === "") {
      return;
    }

    setHeadingElementsById((currentHeadingElementsById) => {
      const currentElement = currentHeadingElementsById[headingId];

      if (isSome(node) && currentElement === node.value) {
        return currentHeadingElementsById;
      }

      if (!isSome(node)) {
        if (!(headingId in currentHeadingElementsById)) {
          return currentHeadingElementsById;
        }

        const nextHeadingElementsById = { ...currentHeadingElementsById };

        delete nextHeadingElementsById[headingId];

        return nextHeadingElementsById;
      }

      return {
        ...currentHeadingElementsById,
        [headingId]: node.value,
      };
    });
  }, []);

  const headings = useMemo<ReadonlyArray<RegisteredArticleHeading>>(
    () =>
      headingOrder.flatMap((headingId) => {
        const element = headingElementsById[headingId];

        return element === undefined ? [] : [{ id: headingId, element }];
      }),
    [headingElementsById, headingOrder],
  );

  const value = useMemo<ArticleDomContextValue>(
    () => ({
      scrollContainer,
      articleBody,
      bottomSentinel,
      headings,
      registerScrollContainer,
      registerArticleBody,
      registerBottomSentinel,
      registerHeadingOrder,
      registerHeading,
    }),
    [
      articleBody,
      bottomSentinel,
      headings,
      registerArticleBody,
      registerBottomSentinel,
      registerHeading,
      registerHeadingOrder,
      registerScrollContainer,
      scrollContainer,
    ],
  );

  const contextValue = useMemo(() => some(value), [value]);

  return <ArticleDomContext.Provider value={contextValue}>{children}</ArticleDomContext.Provider>;
}

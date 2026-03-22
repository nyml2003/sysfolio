import { createContext, useContext } from 'react';

import { isSome, none, type Option } from '@/shared/lib/monads/option';

export type RegisteredArticleHeading = {
  id: string;
  element: HTMLElement;
};

export type ArticleDomContextValue = {
  scrollContainer: Option<HTMLElement>;
  articleBody: Option<HTMLElement>;
  bottomSentinel: Option<HTMLElement>;
  headings: ReadonlyArray<RegisteredArticleHeading>;
  registerScrollContainer: (node: Option<HTMLElement>) => void;
  registerArticleBody: (node: Option<HTMLElement>) => void;
  registerBottomSentinel: (node: Option<HTMLElement>) => void;
  registerHeadingOrder: (headingIds: ReadonlyArray<string>) => void;
  registerHeading: (headingId: string, node: Option<HTMLElement>) => void;
};

export const ArticleDomContext = createContext<Option<ArticleDomContextValue>>(none());

export function useArticleDom(): ArticleDomContextValue {
  const context = useContext(ArticleDomContext);

  if (!isSome(context)) {
    throw new Error('useArticleDom must be used inside ArticleDomProvider.');
  }

  return context.value;
}

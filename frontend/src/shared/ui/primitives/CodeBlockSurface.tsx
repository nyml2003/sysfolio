import { clsx } from 'clsx';

import type { ReactNode } from 'react';

import { isSome } from '@/shared/lib/monads/option';

import type { CodeBlockSurfaceProps } from './code-block-surface.types';

/** 联合 body props 在参数解构时需同时出现可选 code/children（实现层收窄）。 */
type CodeBlockSurfacePropsForImpl = CodeBlockSurfaceProps & {
  code?: string;

  children?: NonNullable<ReactNode>;
};

export function CodeBlockSurface({
  variant,

  lineWrap = false,

  scrollable = true,

  header,

  language,

  meta,

  actions,

  footer,

  code,

  children,

  className,

  ...rest
}: CodeBlockSurfacePropsForImpl) {
  const showHeaderRow = isSome(header) || isSome(language) || isSome(meta) || isSome(actions);

  const bodyScrollable = scrollable && !lineWrap;

  const bodyContent =
    code !== undefined ? (
      <pre className="sf-code-block-surface__pre">
        <code className="sf-code-block-surface__code">{code}</code>
      </pre>
    ) : (
      children
    );

  return (
    <div
      className={clsx(
        'sf-code-block-surface',

        `sf-code-block-surface--${variant}`,

        lineWrap && 'sf-code-block-surface--wrapped',

        className
      )}
      {...rest}
    >
      {showHeaderRow ? (
        <div className="sf-code-block-surface__header">
          <div className="sf-code-block-surface__header-start">
            {isSome(header) ? (
              <div className="sf-code-block-surface__header-slot">{header.value}</div>
            ) : null}

            {isSome(language) ? (
              <span className="sf-code-block-surface__language">{language.value}</span>
            ) : null}
          </div>

          <div className="sf-code-block-surface__header-end">
            {isSome(meta) ? (
              <span className="sf-code-block-surface__meta">{meta.value}</span>
            ) : null}

            {isSome(actions) ? (
              <div className="sf-code-block-surface__actions">{actions.value}</div>
            ) : null}
          </div>
        </div>
      ) : null}

      <div
        className={clsx(
          'sf-code-block-surface__body',

          lineWrap && 'sf-code-block-surface__body--wrapped',

          bodyScrollable && 'sf-code-block-surface__body--scrollable'
        )}
      >
        {bodyContent}
      </div>

      {isSome(footer) ? <div className="sf-code-block-surface__footer">{footer.value}</div> : null}
    </div>
  );
}

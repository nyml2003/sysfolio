import { forwardRef } from 'react';

import { clsx } from 'clsx';

import { isSome } from '@/shared/lib/monads/option';

import { SearchIcon } from './Icon';

import type { SearchInputProps } from './search-input.types';

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    props,

    ref
  ) {
    const {
      variant,

      loading = false,

      leadingSearchIcon,

      clear,

      submit,

      scope,

      className,

      disabled,

      value,

      defaultValue,

      ...inputProps
    } = props;

    const leading = isSome(leadingSearchIcon) ? leadingSearchIcon.value : <SearchIcon size={16} />;

    const filled =
      value !== undefined
        ? String(value).length > 0
        : defaultValue !== undefined && String(defaultValue).length > 0;

    return (
      <div
        className={clsx(
          'sf-search-input',

          `sf-search-input--${variant}`,

          filled && 'sf-search-input--filled',

          loading && 'sf-search-input--loading',

          disabled && 'sf-search-input--disabled',

          className
        )}
      >
        <span aria-hidden className="sf-search-input__leading">
          {leading}
        </span>

        <input
          ref={ref}
          {...inputProps}
          aria-busy={loading || undefined}
          className="sf-search-input__control"
          defaultValue={defaultValue}
          disabled={disabled}
          type="search"
          value={value}
        />

        <div className="sf-search-input__trailing">
          {isSome(clear) ? <span className="sf-search-input__slot">{clear.value}</span> : null}

          {loading ? <span aria-hidden className="sf-search-input__spinner" /> : null}

          {isSome(submit) ? <span className="sf-search-input__slot">{submit.value}</span> : null}

          {isSome(scope) ? <span className="sf-search-input__scope">{scope.value}</span> : null}
        </div>
      </div>
    );
  }
);

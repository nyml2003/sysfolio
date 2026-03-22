import { clsx } from "clsx";

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
};

type SegmentedControlProps<T extends string> = {
  label: string;
  options: ReadonlyArray<SegmentedOption<T>>;
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div aria-label={label} className={clsx("sf-segmented", className)} role="group">
      {options.map((option) => (
        <button
          aria-pressed={option.value === value}
          className={clsx(
            "sf-segmented__button",
            option.value === value && "sf-segmented__button--active",
          )}
          key={option.value}
          onClick={() => {
            onChange(option.value);
          }}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}


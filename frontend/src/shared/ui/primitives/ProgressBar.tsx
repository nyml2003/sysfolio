type ProgressBarProps = {
  value: number;
};

export function ProgressBar({ value }: ProgressBarProps) {
  const normalizedValue = Math.max(0, Math.min(100, value));

  return (
    <div
      aria-label={`Progress ${normalizedValue}%`}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={normalizedValue}
      className="sf-progress"
      role="progressbar"
    >
      <span className="sf-progress__value" style={{ width: `${normalizedValue}%` }} />
    </div>
  );
}


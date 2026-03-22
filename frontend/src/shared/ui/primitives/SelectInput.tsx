import type { SelectHTMLAttributes } from 'react';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function SelectInput({ children, ...props }: SelectProps) {
  return (
    <div className="sf-select">
      <select className="sf-input sf-input--select" {...props}>
        {children}
      </select>
      <span className="sf-select__chevron">▾</span>
    </div>
  );
}

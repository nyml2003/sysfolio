import type { ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

import { Inline, Stack } from "@/shared/ui/layout";

type FieldProps = {
  label: string;
  description?: string;
  children: ReactNode;
};

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;
type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Field({ label, description, children }: FieldProps) {
  return (
    <Stack className="sf-field" gap="xs">
      <label className="sf-field__label">{label}</label>
      {children}
      {description === undefined ? null : (
        <div className="sf-field__description">{description}</div>
      )}
    </Stack>
  );
}

export function TextInput(props: TextInputProps) {
  return <input className="sf-input" {...props} />;
}

export function TextArea(props: TextareaProps) {
  return <textarea className="sf-input sf-input--textarea" {...props} />;
}

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

export function FieldRow({ children }: { children: ReactNode }) {
  return (
    <Inline align="start" className="sf-field-row" gap="md" wrap>
      {children}
    </Inline>
  );
}


import type { ReactNode } from "react";

import { isSome, none, type Option } from "@/shared/lib/monads/option";
import { Stack } from "@/shared/ui/layout";

type FieldProps = {
  label: string;
  description: Option<string>;
  children: ReactNode;
};

export function Field({
  label,
  description = none(),
  children,
}: FieldProps) {
  return (
    <Stack className="sf-field" gap="xs">
      <label className="sf-field__label">{label}</label>
      {children}
      {isSome(description) ? (
        <div className="sf-field__description">{description.value}</div>
      ) : null}
    </Stack>
  );
}

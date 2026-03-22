import type { ReactNode } from 'react';

import { isSome, none, type Option } from '@/shared/lib/monads/option';
import { Stack } from '@/shared/ui/layout';

import { Label } from './Label';

type FieldProps = {
  label: string;
  description: Option<string>;
  children: ReactNode;
};

export function Field({ label, description = none(), children }: FieldProps) {
  return (
    <Stack className="sf-field" gap="xs">
      <Label
        htmlFor={none()}
        infoAffordance={none()}
        optionalMark={none()}
        requiredMark={none()}
        state="default"
        variant="default"
      >
        {label}
      </Label>
      {children}
      {isSome(description) ? (
        <div className="sf-field__description">{description.value}</div>
      ) : null}
    </Stack>
  );
}

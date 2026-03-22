import type { ReactNode } from "react";

import { Inline } from "@/shared/ui/layout";

export function FieldRow({ children }: { children: ReactNode }) {
  return (
    <Inline align="start" className="sf-field-row" gap="md" wrap>
      {children}
    </Inline>
  );
}

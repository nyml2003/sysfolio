import { Field, FieldRow, SelectInput, TextArea, TextInput } from "@/shared/ui/primitives";
import { some } from "@/shared/lib/monads/option";

export function FieldInputDemo() {
  return (
    <FieldRow>
      <Field description={some("Shared calm field surface.")} label="Text input">
        <TextInput defaultValue="Button copy" />
      </Field>
      <Field description={some("Textarea follows the same token family.")} label="Notes">
        <TextArea defaultValue="Design asks should stay visible." rows={4} />
      </Field>
      <Field description={some("Select trigger stays inside the same field system.")} label="Density">
        <SelectInput defaultValue="comfortable">
          <option value="comfortable">Comfortable</option>
          <option value="medium">Medium</option>
          <option value="compact">Compact</option>
        </SelectInput>
      </Field>
    </FieldRow>
  );
}

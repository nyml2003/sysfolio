import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextArea(props: TextareaProps) {
  return <textarea className="sf-input sf-input--textarea" {...props} />;
}

import { fromNullable, none, some, type Option } from "@/shared/lib/monads/option";

export function getWindowOption(): Option<Window> {
  return typeof window === "undefined" ? none() : some(window);
}

export function getDocumentOption(): Option<Document> {
  return typeof document === "undefined" ? none() : some(document);
}

export function getDocumentElementOption(): Option<HTMLElement> {
  return fromNullable(typeof document === "undefined" ? null : document.documentElement);
}

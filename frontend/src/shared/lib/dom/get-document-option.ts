import { none, some, type Option } from "@/shared/lib/monads/option";

export function getDocumentOption(): Option<Document> {
  return typeof document === "undefined" ? none() : some(document);
}

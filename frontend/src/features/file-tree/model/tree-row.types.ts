import type { ContentNode } from "@/entities/content";

export type TreeRow = {
  node: ContentNode;
  depth: number;
  isExpanded: boolean;
  isSelected: boolean;
};

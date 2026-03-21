import { startTransition, useEffect, useEffectEvent, useState } from "react";

import type { RepositoryError } from "@/entities/content";
import { useContentRepository } from "@/shared/data/repository";
import { idleState, loadingState, type ResourceState } from "@/shared/lib/resource/resource-state";

import {
  buildVisibleRows,
  createTreeIndex,
  getDefaultExpandedIds,
  mergeExpandedIds,
  mergeNodes,
  toggleExpanded,
  type TreeIndex,
} from "../model/file-tree.model";

type UseFileTreeResult = {
  rows: ReturnType<typeof buildVisibleRows>;
  rootState: ResourceState<TreeIndex, RepositoryError>;
  loadingNodeIds: string[];
  expandedIds: string[];
  toggleNode: (nodeId: string) => void;
};

export function useFileTree(currentPath: string): UseFileTreeResult {
  const repository = useContentRepository();
  const [rootState, setRootState] = useState<ResourceState<TreeIndex, RepositoryError>>(
    idleState(),
  );
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [loadingNodeIds, setLoadingNodeIds] = useState<string[]>([]);

  const loadRoot = useEffectEvent(async () => {
    setRootState(loadingState());
    const treeRootResource = await repository.getTreeRoot();

    if (treeRootResource.tag !== "ready") {
      setRootState(treeRootResource);
      return;
    }

    const nextIndex = createTreeIndex(treeRootResource.value);

    startTransition(() => {
      setRootState({
        tag: "ready",
        value: nextIndex,
      });
      setExpandedIds(getDefaultExpandedIds(nextIndex));
    });
  });

  const loadChildren = useEffectEvent(async (nodeId: string) => {
    if (loadingNodeIds.includes(nodeId)) {
      return;
    }

    setLoadingNodeIds((currentIds) => [...currentIds, nodeId]);
    const childrenResource = await repository.loadChildren(nodeId, 1);

    startTransition(() => {
      setLoadingNodeIds((currentIds) => currentIds.filter((id) => id !== nodeId));

      if (childrenResource.tag !== "ready") {
        return;
      }

      setRootState((currentState) => {
        if (currentState.tag !== "ready") {
          return currentState;
        }

        return {
          tag: "ready",
          value: mergeNodes(currentState.value, childrenResource.value.nodes),
        };
      });
    });
  });

  const ensurePathLoaded = useEffectEvent(async () => {
    if (rootState.tag !== "ready") {
      return;
    }

    const nodeResource = await repository.getNodeByPath(currentPath);

    if (nodeResource.tag !== "ready") {
      return;
    }

    const currentNode = nodeResource.value;

    for (const ancestorId of currentNode.ancestorIds) {
      if (
        ancestorId !== rootState.value.rootId &&
        rootState.value.childrenByParentId[ancestorId] === undefined
      ) {
        await loadChildren(ancestorId);
      }
    }

    if (
      currentNode.kind === "folder" &&
      currentNode.hasChildren &&
      rootState.value.childrenByParentId[currentNode.id] === undefined
    ) {
      await loadChildren(currentNode.id);
    }

    startTransition(() => {
      setExpandedIds((currentIds) =>
        mergeExpandedIds(
          currentIds,
          currentNode.kind === "folder"
            ? [...currentNode.ancestorIds, currentNode.id]
            : currentNode.ancestorIds,
        ),
      );
    });
  });

  useEffect(() => {
    void loadRoot();
  }, [loadRoot]);

  useEffect(() => {
    void ensurePathLoaded();
  }, [currentPath, ensurePathLoaded, rootState]);

  const rows =
    rootState.tag === "ready"
      ? buildVisibleRows(rootState.value, expandedIds, currentPath)
      : [];

  return {
    rows,
    rootState,
    loadingNodeIds,
    expandedIds,
    toggleNode(nodeId) {
      setExpandedIds((currentIds) => toggleExpanded(currentIds, nodeId));
    },
  };
}

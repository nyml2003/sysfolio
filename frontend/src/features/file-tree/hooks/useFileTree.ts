import { startTransition, useEffect, useRef, useState } from "react";

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
  const loadingNodeIdsRef = useRef<string[]>([]);

  useEffect(() => {
    loadingNodeIdsRef.current = loadingNodeIds;
  }, [loadingNodeIds]);

  async function loadChildren(nodeId: string) {
    if (loadingNodeIdsRef.current.includes(nodeId)) {
      return;
    }

    loadingNodeIdsRef.current = [...loadingNodeIdsRef.current, nodeId];
    setLoadingNodeIds(loadingNodeIdsRef.current);
    const childrenResource = await repository.loadChildren(nodeId, 1);

    startTransition(() => {
      loadingNodeIdsRef.current = loadingNodeIdsRef.current.filter((id) => id !== nodeId);
      setLoadingNodeIds(loadingNodeIdsRef.current);

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
  }

  useEffect(() => {
    let cancelled = false;

    setRootState(loadingState());
    void repository.getTreeRoot().then((treeRootResource) => {
      if (cancelled) {
        return;
      }

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

    return () => {
      cancelled = true;
    };
  }, [repository]);

  useEffect(() => {
    if (rootState.tag !== "ready") {
      return;
    }

    let cancelled = false;

    void repository.getNodeByPath(currentPath).then(async (nodeResource) => {
      if (cancelled || nodeResource.tag !== "ready") {
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

      if (cancelled) {
        return;
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

    return () => {
      cancelled = true;
    };
  }, [currentPath, repository, rootState]);

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
      if (
        rootState.tag === "ready" &&
        rootState.value.nodesById[nodeId]?.kind === "folder" &&
        rootState.value.nodesById[nodeId]?.hasChildren &&
        rootState.value.childrenByParentId[nodeId] === undefined
      ) {
        void loadChildren(nodeId);
      }

      setExpandedIds((currentIds) => toggleExpanded(currentIds, nodeId));
    },
  };
}

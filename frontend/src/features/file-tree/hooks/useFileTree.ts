import { startTransition, useCallback, useEffect, useRef, useState } from "react";

import type { RepositoryError } from "@/entities/content";
import { useContentRepository } from "@/shared/data/repository";
import { detachPromise } from "@/shared/lib/async/detach-promise";
import { idleState, loadingState, type ResourceState } from "@/shared/lib/resource/resource-state";
import { usePreferences } from "@/shared/store/preferences";

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

function getExpandedIdsForNode(node: TreeIndex["nodesById"][string]): string[] {
  return node.kind === "folder" ? [...node.ancestorIds, node.id] : node.ancestorIds;
}

async function ensureNodeBranchLoaded(
  currentNode: TreeIndex["nodesById"][string],
  rootIndex: TreeIndex,
  loadChildren: (nodeId: string) => Promise<void>,
) {
  for (const ancestorId of currentNode.ancestorIds) {
    if (
      ancestorId !== rootIndex.rootId &&
      rootIndex.childrenByParentId[ancestorId] === undefined
    ) {
      await loadChildren(ancestorId);
    }
  }

  if (
    currentNode.kind === "folder" &&
    currentNode.hasChildren &&
    rootIndex.childrenByParentId[currentNode.id] === undefined
  ) {
    await loadChildren(currentNode.id);
  }
}

export function useFileTree(currentPath: string): UseFileTreeResult {
  const repository = useContentRepository();
  const { locale } = usePreferences();
  const [rootState, setRootState] = useState<ResourceState<TreeIndex, RepositoryError>>(
    idleState(),
  );
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [loadingNodeIds, setLoadingNodeIds] = useState<string[]>([]);
  const loadingNodeIdsRef = useRef<string[]>([]);

  useEffect(() => {
    loadingNodeIdsRef.current = loadingNodeIds;
  }, [loadingNodeIds]);

  const loadChildren = useCallback(async (nodeId: string) => {
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
  }, [repository]);

  useEffect(() => {
    const abortController = new AbortController();
    const loadTreeRoot = async () => {
      const treeRootResource = await repository.getTreeRoot();

      if (abortController.signal.aborted) {
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
    };

    setRootState(loadingState());
    detachPromise(loadTreeRoot());

    return () => {
      abortController.abort();
    };
  }, [locale, repository]);

  useEffect(() => {
    if (rootState.tag !== "ready") {
      return;
    }

    const abortController = new AbortController();
    const syncExpandedBranch = async () => {
      const nodeResource = await repository.getNodeByPath(currentPath);

      if (abortController.signal.aborted || nodeResource.tag !== "ready") {
        return;
      }

      const currentNode = nodeResource.value;

      await ensureNodeBranchLoaded(currentNode, rootState.value, loadChildren);

      if (abortController.signal.aborted) {
        return;
      }

      startTransition(() => {
        setExpandedIds((currentIds) =>
          mergeExpandedIds(currentIds, getExpandedIdsForNode(currentNode)),
        );
      });
    };

    detachPromise(syncExpandedBranch());

    return () => {
      abortController.abort();
    };
  }, [currentPath, repository, rootState, loadChildren]);

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
        detachPromise(loadChildren(nodeId));
      }

      setExpandedIds((currentIds) => toggleExpanded(currentIds, nodeId));
    },
  };
}

import { startTransition, useCallback, useEffect, useRef, useState } from 'react';

import type { RepositoryError } from '@/entities/content';
import { useContentRepository } from '@/shared/data/repository';
import { detachPromise } from '@/shared/lib/async/detach-promise';
import { idleState, loadingState, type ResourceState } from '@/shared/lib/resource/resource-state';
import { usePreferences } from '@/shared/store/preferences';

import {
  buildVisibleRows,
  createTreeIndex,
  getDefaultExpandedIds,
  mergeExpandedIds,
  mergeNodes,
  toggleExpanded,
  type TreeIndex,
} from '../model';

type UseFileTreeResult = {
  rows: ReturnType<typeof buildVisibleRows>;
  rootState: ResourceState<TreeIndex, RepositoryError>;
  loadingNodeIds: string[];
  expandedIds: string[];
  nodeErrorsById: Record<string, RepositoryError>;
  toggleNode: (nodeId: string) => void;
  retryNode: (nodeId: string) => void;
};

type LoadChildrenResult = 'loaded' | 'failed' | 'skipped' | 'stale';

function getExpandedIdsForNode(node: TreeIndex['nodesById'][string]): string[] {
  return node.kind === 'folder' ? [...node.ancestorIds, node.id] : node.ancestorIds;
}

async function ensureNodeBranchLoaded(
  currentNode: TreeIndex['nodesById'][string],
  rootIndex: TreeIndex,
  loadChildren: (nodeId: string) => Promise<unknown>
) {
  for (const ancestorId of currentNode.ancestorIds) {
    if (ancestorId !== rootIndex.rootId && rootIndex.childrenByParentId[ancestorId] === undefined) {
      await loadChildren(ancestorId);
    }
  }

  if (
    currentNode.kind === 'folder' &&
    currentNode.hasChildren &&
    rootIndex.childrenByParentId[currentNode.id] === undefined
  ) {
    await loadChildren(currentNode.id);
  }
}

export function useFileTree(currentPath: string): UseFileTreeResult {
  const repository = useContentRepository();
  const { locale } = usePreferences();
  const [rootState, setRootState] =
    useState<ResourceState<TreeIndex, RepositoryError>>(idleState());
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [loadingNodeIds, setLoadingNodeIds] = useState<string[]>([]);
  const [nodeErrorsById, setNodeErrorsById] = useState<Record<string, RepositoryError>>({});
  const loadingNodeIdsRef = useRef<string[]>([]);
  const treeVersionRef = useRef(0);

  useEffect(() => {
    loadingNodeIdsRef.current = loadingNodeIds;
  }, [loadingNodeIds]);

  const loadChildren = useCallback(
    async (
      nodeId: string,
      treeVersion: number = treeVersionRef.current
    ): Promise<LoadChildrenResult> => {
      if (treeVersion !== treeVersionRef.current) {
        return 'stale';
      }

      if (loadingNodeIdsRef.current.includes(nodeId)) {
        return 'skipped';
      }

      loadingNodeIdsRef.current = [...loadingNodeIdsRef.current, nodeId];
      setLoadingNodeIds(loadingNodeIdsRef.current);
      setNodeErrorsById((currentErrors) => {
        if (!(nodeId in currentErrors)) {
          return currentErrors;
        }

        const nextErrors = { ...currentErrors };

        delete nextErrors[nodeId];

        return nextErrors;
      });
      const childrenResource = await repository.loadChildren(nodeId, 1);

      if (treeVersion !== treeVersionRef.current) {
        return 'stale';
      }

      startTransition(() => {
        loadingNodeIdsRef.current = loadingNodeIdsRef.current.filter((id) => id !== nodeId);
        setLoadingNodeIds(loadingNodeIdsRef.current);

        if (childrenResource.tag !== 'ready') {
          if (childrenResource.tag === 'error') {
            setNodeErrorsById((currentErrors) => ({
              ...currentErrors,
              [nodeId]: childrenResource.error,
            }));
          }

          return;
        }

        setNodeErrorsById((currentErrors) => {
          if (!(nodeId in currentErrors)) {
            return currentErrors;
          }

          const nextErrors = { ...currentErrors };

          delete nextErrors[nodeId];

          return nextErrors;
        });

        setRootState((currentState) => {
          if (currentState.tag !== 'ready') {
            return currentState;
          }

          return {
            tag: 'ready',
            value: mergeNodes(currentState.value, childrenResource.value.nodes),
          };
        });
      });

      return childrenResource.tag === 'ready' ? 'loaded' : 'failed';
    },
    [repository]
  );

  useEffect(() => {
    const abortController = new AbortController();
    const nextTreeVersion = treeVersionRef.current + 1;

    treeVersionRef.current = nextTreeVersion;
    loadingNodeIdsRef.current = [];

    const loadTreeRoot = async () => {
      const treeRootResource = await repository.getTreeRoot();

      if (abortController.signal.aborted || nextTreeVersion !== treeVersionRef.current) {
        return;
      }

      if (treeRootResource.tag !== 'ready') {
        setRootState(treeRootResource);
        return;
      }

      const nextIndex = createTreeIndex(treeRootResource.value);

      startTransition(() => {
        setLoadingNodeIds([]);
        setNodeErrorsById({});
        setRootState({
          tag: 'ready',
          value: nextIndex,
        });
        setExpandedIds(getDefaultExpandedIds(nextIndex));
      });
    };

    startTransition(() => {
      setLoadingNodeIds([]);
      setNodeErrorsById({});
      setExpandedIds([]);
      setRootState(loadingState());
    });
    detachPromise(loadTreeRoot());

    return () => {
      abortController.abort();
    };
  }, [locale, repository]);

  useEffect(() => {
    if (rootState.tag !== 'ready') {
      return;
    }

    const abortController = new AbortController();
    const treeVersion = treeVersionRef.current;
    const syncExpandedBranch = async () => {
      const nodeResource = await repository.getNodeByPath(currentPath);

      if (
        abortController.signal.aborted ||
        treeVersion !== treeVersionRef.current ||
        nodeResource.tag !== 'ready'
      ) {
        return;
      }

      const currentNode = nodeResource.value;

      await ensureNodeBranchLoaded(currentNode, rootState.value, (nodeId) =>
        loadChildren(nodeId, treeVersion)
      );

      if (abortController.signal.aborted || treeVersion !== treeVersionRef.current) {
        return;
      }

      startTransition(() => {
        setExpandedIds((currentIds) =>
          mergeExpandedIds(currentIds, getExpandedIdsForNode(currentNode))
        );
      });
    };

    detachPromise(syncExpandedBranch());

    return () => {
      abortController.abort();
    };
  }, [currentPath, repository, rootState, loadChildren]);

  const rows =
    rootState.tag === 'ready' ? buildVisibleRows(rootState.value, expandedIds, currentPath) : [];

  return {
    rows,
    rootState,
    loadingNodeIds,
    expandedIds,
    nodeErrorsById,
    toggleNode(nodeId) {
      if (nodeErrorsById[nodeId] !== undefined) {
        detachPromise(loadChildren(nodeId));
        return;
      }

      if (
        rootState.tag === 'ready' &&
        rootState.value.nodesById[nodeId]?.kind === 'folder' &&
        rootState.value.nodesById[nodeId]?.hasChildren &&
        rootState.value.childrenByParentId[nodeId] === undefined
      ) {
        detachPromise(loadChildren(nodeId));
      }

      setExpandedIds((currentIds) => toggleExpanded(currentIds, nodeId));
    },
    retryNode(nodeId) {
      detachPromise(loadChildren(nodeId));
    },
  };
}

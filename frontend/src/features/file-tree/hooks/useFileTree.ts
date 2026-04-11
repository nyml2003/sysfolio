import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { RepositoryError } from '@/entities/content';
import { useContentRepository } from '@/shared/data/repository';
import { detachPromise } from '@/shared/lib/async/detach-promise';
import { clearScheduledTimeout } from '@/shared/lib/dom/clear-scheduled-timeout';
import { scheduleTimeout } from '@/shared/lib/dom/schedule-timeout';
import { useResourceQuery, type ResourceQuery } from '@/shared/lib/query';
import { idleState, loadingState, type ResourceState } from '@/shared/lib/resource/resource-state';
import { readyState } from '@/shared/lib/resource/resource-state';
import { usePreferences } from '@/shared/store/preferences';

import {
  buildVisibleRows,
  createTreeIndex,
  getFirstChildRowId,
  getFirstRowId,
  getDefaultExpandedIds,
  getLastRowId,
  getNextRowId,
  getParentRowId,
  getPreviousRowId,
  getSelectedOrFirstRowId,
  mergeExpandedIds,
  mergeNodes,
  resolveTypeaheadMatch,
  toggleExpanded,
  type TreeIndex,
} from '../model';
import { FILE_TREE_TYPEAHEAD_RESET_MS } from '../constant';

type UseFileTreeResult = {
  rows: ReturnType<typeof buildVisibleRows>;
  rootQuery: ResourceQuery<TreeIndex, RepositoryError>;
  rootState: ResourceState<TreeIndex, RepositoryError>;
  loadingNodeIds: string[];
  expandedIds: string[];
  selectedPath: string;
  focusedNodeId: string;
  nodeQueryStatusById: Record<string, TreeNodeQueryStatus>;
  nodeFreshnessById: Record<string, TreeNodeFreshness>;
  typeaheadBuffer: string;
  nodeErrorsById: Record<string, RepositoryError>;
  toggleNode: (nodeId: string) => void;
  retryNode: (nodeId: string) => void;
  focusNode: (nodeId: string) => void;
  focusFirstNode: () => void;
  focusLastNode: () => void;
  focusNextNode: () => void;
  focusPreviousNode: () => void;
  focusParentNode: () => void;
  focusChildNode: () => void;
  appendTypeaheadCharacter: (character: string) => void;
};

type LoadChildrenResult = 'loaded' | 'failed' | 'skipped' | 'stale';
type TreeNodeQueryStatus = 'idle' | 'loading' | 'ready' | 'error';
type TreeNodeFreshness = 'fresh' | 'stale';

function getExpandedIdsForNode(node: TreeIndex['nodesById'][string]): string[] {
  return node.kind === 'folder' ? [...node.ancestorIds, node.id] : node.ancestorIds;
}

function createInitialNodeQueryStatusById(index: TreeIndex): Record<string, TreeNodeQueryStatus> {
  return Object.keys(index.nodesById).reduce<Record<string, TreeNodeQueryStatus>>(
    (currentStatusById, nodeId) => ({
      ...currentStatusById,
      [nodeId]: index.childrenByParentId[nodeId] === undefined ? 'idle' : 'ready',
    }),
    {}
  );
}

function createInitialNodeFreshnessById(index: TreeIndex): Record<string, TreeNodeFreshness> {
  return Object.keys(index.childrenByParentId).reduce<Record<string, TreeNodeFreshness>>(
    (currentFreshnessById, nodeId) => ({
      ...currentFreshnessById,
      [nodeId]: 'fresh',
    }),
    {}
  );
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
  const [focusedNodeId, setFocusedNodeId] = useState('');
  const [pendingChildFocusNodeId, setPendingChildFocusNodeId] = useState('');
  const [nodeFreshnessById, setNodeFreshnessById] = useState<Record<string, TreeNodeFreshness>>({});
  const [nodeQueryStatusById, setNodeQueryStatusById] = useState<
    Record<string, TreeNodeQueryStatus>
  >({});
  const [typeaheadBuffer, setTypeaheadBuffer] = useState('');
  const [nodeErrorsById, setNodeErrorsById] = useState<Record<string, RepositoryError>>({});
  const focusedNodeIdRef = useRef('');
  const loadingNodeIdsRef = useRef<string[]>([]);
  const treeVersionRef = useRef(0);
  const typeaheadBufferRef = useRef('');
  const typeaheadTimeoutIdRef = useRef(0);
  const loadTreeRoot = useCallback(async (): Promise<ResourceState<TreeIndex, RepositoryError>> => {
    const treeRootResource = await repository.getTreeRoot();

    if (treeRootResource.tag !== 'ready') {
      return treeRootResource;
    }

    return readyState(createTreeIndex(treeRootResource.value));
  }, [repository]);
  const rootQuery = useResourceQuery({
    queryKey: ['tree-root', locale],
    load: loadTreeRoot,
  });

  useEffect(() => {
    loadingNodeIdsRef.current = loadingNodeIds;
  }, [loadingNodeIds]);

  useEffect(() => {
    focusedNodeIdRef.current = focusedNodeId;
  }, [focusedNodeId]);

  useEffect(() => {
    typeaheadBufferRef.current = typeaheadBuffer;
  }, [typeaheadBuffer]);

  const clearTypeaheadBuffer = useCallback(() => {
    clearScheduledTimeout(typeaheadTimeoutIdRef.current);
    typeaheadTimeoutIdRef.current = 0;
    typeaheadBufferRef.current = '';
    setTypeaheadBuffer('');
  }, []);

  const updateFocusedNodeId = useCallback((nextFocusedNodeId: string) => {
    focusedNodeIdRef.current = nextFocusedNodeId;
    setFocusedNodeId(nextFocusedNodeId);
  }, []);

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
      setNodeQueryStatusById((currentStatusById) => ({
        ...currentStatusById,
        [nodeId]: 'loading',
      }));
      setNodeFreshnessById((currentFreshnessById) => ({
        ...currentFreshnessById,
        [nodeId]: 'stale',
      }));
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
            setNodeQueryStatusById((currentStatusById) => ({
              ...currentStatusById,
              [nodeId]: 'error',
            }));
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
        setNodeQueryStatusById((currentStatusById) => ({
          ...currentStatusById,
          [nodeId]: 'ready',
        }));
        setNodeFreshnessById((currentFreshnessById) => ({
          ...currentFreshnessById,
          [nodeId]: 'fresh',
        }));

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
    const nextTreeVersion = treeVersionRef.current + 1;

    treeVersionRef.current = nextTreeVersion;
    loadingNodeIdsRef.current = [];

    startTransition(() => {
      setLoadingNodeIds([]);
      setNodeQueryStatusById({});
      setNodeFreshnessById({});
      setNodeErrorsById({});
      setExpandedIds([]);
      updateFocusedNodeId('');
      setPendingChildFocusNodeId('');
      setTypeaheadBuffer('');
      setRootState(loadingState());
    });

    return () => {
      clearTypeaheadBuffer();
    };
  }, [clearTypeaheadBuffer, rootQuery.requestVersion, updateFocusedNodeId]);

  useEffect(() => {
    if (rootQuery.resource.tag !== 'ready') {
      setRootState(rootQuery.resource);
      return;
    }

    setRootState({
      tag: 'ready',
      value: rootQuery.resource.value,
    });
  }, [rootQuery.resource]);

  useEffect(() => {
    if (rootState.tag !== 'ready') {
      return;
    }

    startTransition(() => {
      setLoadingNodeIds([]);
      setNodeQueryStatusById(createInitialNodeQueryStatusById(rootState.value));
      setNodeFreshnessById(createInitialNodeFreshnessById(rootState.value));
      setNodeErrorsById({});
      setExpandedIds(getDefaultExpandedIds(rootState.value));
    });
  }, [rootState]);

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
  }, [currentPath, loadChildren, repository, rootState]);

  const rows = useMemo(
    () =>
      rootState.tag === 'ready' ? buildVisibleRows(rootState.value, expandedIds, currentPath) : [],
    [currentPath, expandedIds, rootState]
  );

  useEffect(() => {
    const selectedNodeId = getSelectedOrFirstRowId(rows);

    if (selectedNodeId === '') {
      if (focusedNodeId !== '') {
        updateFocusedNodeId('');
      }

      return;
    }

    setFocusedNodeId((currentFocusedNodeId) => {
      if (
        currentFocusedNodeId === '' ||
        !rows.some((row) => row.node.id === currentFocusedNodeId)
      ) {
        focusedNodeIdRef.current = selectedNodeId;
        return selectedNodeId;
      }

      return currentFocusedNodeId;
    });
  }, [currentPath, focusedNodeId, rows, updateFocusedNodeId]);

  useEffect(() => {
    if (pendingChildFocusNodeId === '') {
      return;
    }

    const childNodeId = getFirstChildRowId(rows, pendingChildFocusNodeId);

    if (childNodeId === pendingChildFocusNodeId || childNodeId === '') {
      return;
    }

    updateFocusedNodeId(childNodeId);
    setPendingChildFocusNodeId('');
  }, [pendingChildFocusNodeId, rows, updateFocusedNodeId]);

  useEffect(() => {
    return () => {
      clearTypeaheadBuffer();
    };
  }, [clearTypeaheadBuffer]);

  const requestChildrenLoad = useCallback(
    (nodeId: string) => {
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
    },
    [loadChildren, nodeErrorsById, rootState]
  );

  const expandNode = useCallback(
    (nodeId: string) => {
      requestChildrenLoad(nodeId);
      setExpandedIds((currentIds) => mergeExpandedIds(currentIds, [nodeId]));
    },
    [requestChildrenLoad]
  );

  const collapseNode = useCallback((nodeId: string) => {
    setExpandedIds((currentIds) => currentIds.filter((id) => id !== nodeId));
  }, []);

  return {
    rows,
    rootQuery,
    rootState,
    loadingNodeIds,
    expandedIds,
    selectedPath: currentPath,
    focusedNodeId,
    nodeQueryStatusById,
    nodeFreshnessById,
    typeaheadBuffer,
    nodeErrorsById,
    focusNode(nodeId) {
      updateFocusedNodeId(nodeId);
    },
    focusFirstNode() {
      clearTypeaheadBuffer();
      updateFocusedNodeId(getFirstRowId(rows));
    },
    focusLastNode() {
      clearTypeaheadBuffer();
      updateFocusedNodeId(getLastRowId(rows));
    },
    focusNextNode() {
      clearTypeaheadBuffer();
      updateFocusedNodeId(getNextRowId(rows, focusedNodeIdRef.current));
    },
    focusPreviousNode() {
      clearTypeaheadBuffer();
      updateFocusedNodeId(getPreviousRowId(rows, focusedNodeIdRef.current));
    },
    focusParentNode() {
      clearTypeaheadBuffer();

      const currentRow = rows.find((row) => row.node.id === focusedNodeId);

      if (currentRow?.node.kind === 'folder' && expandedIds.includes(currentRow.node.id)) {
        collapseNode(currentRow.node.id);
        return;
      }

      updateFocusedNodeId(getParentRowId(rows, focusedNodeIdRef.current));
    },
    focusChildNode() {
      clearTypeaheadBuffer();

      const currentRow = rows.find((row) => row.node.id === focusedNodeId);

      if (
        currentRow === undefined ||
        currentRow.node.kind !== 'folder' ||
        !currentRow.node.hasChildren
      ) {
        return;
      }

      if (!expandedIds.includes(currentRow.node.id)) {
        setPendingChildFocusNodeId(currentRow.node.id);
        expandNode(currentRow.node.id);
        return;
      }

      updateFocusedNodeId(getFirstChildRowId(rows, currentRow.node.id));
    },
    appendTypeaheadCharacter(character) {
      if (character.length !== 1 || character.trim() === '') {
        return;
      }

      clearScheduledTimeout(typeaheadTimeoutIdRef.current);
      typeaheadTimeoutIdRef.current = scheduleTimeout(() => {
        typeaheadTimeoutIdRef.current = 0;
        typeaheadBufferRef.current = '';
        setTypeaheadBuffer('');
      }, FILE_TREE_TYPEAHEAD_RESET_MS);
      const nextBuffer = `${typeaheadBufferRef.current}${character.toLocaleLowerCase(locale)}`;
      const matchedNodeId = resolveTypeaheadMatch(
        rows,
        nextBuffer,
        focusedNodeIdRef.current,
        locale
      );

      typeaheadBufferRef.current = nextBuffer;
      setTypeaheadBuffer(nextBuffer);

      if (matchedNodeId !== '') {
        updateFocusedNodeId(matchedNodeId);
      }
    },
    toggleNode(nodeId) {
      clearTypeaheadBuffer();
      requestChildrenLoad(nodeId);
      setExpandedIds((currentIds) => toggleExpanded(currentIds, nodeId));
    },
    retryNode(nodeId) {
      clearTypeaheadBuffer();
      detachPromise(loadChildren(nodeId));
    },
  };
}

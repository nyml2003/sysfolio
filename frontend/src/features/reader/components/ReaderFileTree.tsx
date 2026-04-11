import { FileTreeView } from '@/features/file-tree/components/FileTree';

import { useReaderActions } from '../hooks/useReaderActions';
import { useReaderSelector } from '../hooks/useReaderSelector';

type ReaderFileTreeProps = {
  onNavigate: (path: string) => void;
};

export function ReaderFileTree({ onNavigate }: ReaderFileTreeProps) {
  const appendTypeaheadCharacter = useReaderSelector(
    (state) => state.tree.appendTypeaheadCharacter
  );
  const expandedIds = useReaderSelector((state) => state.tree.expandedIds);
  const focusChildNode = useReaderSelector((state) => state.tree.focusChildNode);
  const focusFirstNode = useReaderSelector((state) => state.tree.focusFirstNode);
  const focusLastNode = useReaderSelector((state) => state.tree.focusLastNode);
  const focusNextNode = useReaderSelector((state) => state.tree.focusNextNode);
  const focusNode = useReaderSelector((state) => state.tree.focusNode);
  const focusParentNode = useReaderSelector((state) => state.tree.focusParentNode);
  const focusPreviousNode = useReaderSelector((state) => state.tree.focusPreviousNode);
  const focusedNodeId = useReaderSelector((state) => state.tree.focusedNodeId);
  const { retryTreeNode, toggleTreeNode } = useReaderActions();
  const loadingNodeIds = useReaderSelector((state) => state.tree.loadingNodeIds);
  const nodeErrorsById = useReaderSelector((state) => state.tree.nodeErrorsById);
  const rootState = useReaderSelector((state) => state.tree.rootState);
  const rows = useReaderSelector((state) => state.tree.rows);
  const typeaheadBuffer = useReaderSelector((state) => state.tree.typeaheadBuffer);

  return (
    <FileTreeView
      appendTypeaheadCharacter={appendTypeaheadCharacter}
      expandedIds={expandedIds}
      focusChildNode={focusChildNode}
      focusFirstNode={focusFirstNode}
      focusLastNode={focusLastNode}
      focusNextNode={focusNextNode}
      focusNode={focusNode}
      focusParentNode={focusParentNode}
      focusPreviousNode={focusPreviousNode}
      focusedNodeId={focusedNodeId}
      loadingNodeIds={loadingNodeIds}
      nodeErrorsById={nodeErrorsById}
      onNavigate={onNavigate}
      retryNode={retryTreeNode}
      rootState={rootState}
      rows={rows}
      typeaheadBuffer={typeaheadBuffer}
      toggleNode={toggleTreeNode}
    />
  );
}

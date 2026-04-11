import { ContextPanel } from '@/features/context-panel/components/ContextPanel';

import { useReaderActions } from '../hooks/useReaderActions';
import { useReaderSelector } from '../hooks/useReaderSelector';

type ReaderContextPanelProps = {
  onNavigate: (path: string) => void;
};

export function ReaderContextPanel({ onNavigate }: ReaderContextPanelProps) {
  const { scrollToHeading } = useReaderActions();
  const activeHeadingId = useReaderSelector((state) => state.reading.state.activeHeadingId);
  const contextResource = useReaderSelector((state) => state.contextQuery.resource);
  const artifactResource = useReaderSelector((state) => state.artifactQuery.resource);

  return (
    <ContextPanel
      activeHeadingId={activeHeadingId}
      artifactResource={artifactResource}
      contextResource={contextResource}
      onNavigate={onNavigate}
      onScrollToHeading={scrollToHeading}
    />
  );
}

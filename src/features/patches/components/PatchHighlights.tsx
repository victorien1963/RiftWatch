import { EmptyState } from '../../../shared/components/EmptyState';
import type { PatchNote } from '../types';
import { PatchCard } from './PatchCard';
import styles from './PatchHighlights.module.css';

type PatchHighlightsProps = {
  patches: PatchNote[];
};

export const PatchHighlights = ({ patches }: PatchHighlightsProps) => {
  if (patches.length === 0) {
    return (
      <EmptyState
        icon="bi-sliders"
        title="暫無版本重點"
        description="下一次版本更新後會整理重點變化。"
      />
    );
  }

  return (
    <div className={styles.scroller}>
      {patches.map((patch) => (
        <div className={styles.item} key={patch.id}>
          <PatchCard patch={patch} />
        </div>
      ))}
    </div>
  );
};

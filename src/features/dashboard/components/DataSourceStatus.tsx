import { Badge } from '../../../shared/components/Badge';
import type { DataSourceStatusKind, IngestMetadata } from '../../../shared/types';
import { formatDateTime } from '../../../shared/utils/date';
import styles from './DataSourceStatus.module.css';

type DataSourceStatusProps = {
  metadata: IngestMetadata;
};

const statusLabel: Record<DataSourceStatusKind, string> = {
  fallback: 'Fallback',
  mock: 'Mock',
  synced: 'Synced',
};

const statusTone: Record<DataSourceStatusKind, 'blue' | 'gold' | 'green'> = {
  fallback: 'gold',
  mock: 'blue',
  synced: 'green',
};

export const DataSourceStatus = ({ metadata }: DataSourceStatusProps) => (
  <div className={styles.panel}>
    <div className={styles.summary}>
      <span>最後更新</span>
      <strong>{formatDateTime(metadata.generatedAt)}</strong>
    </div>

    <div className={styles.list}>
      {metadata.sources.map((source) => (
        <div className={styles.row} key={source.dataset}>
          <div className={styles.source}>
            <strong>{source.label}</strong>
            {source.sourceUrl ? (
              <a href={source.sourceUrl} target="_blank" rel="noreferrer">
                {source.sourceName}
              </a>
            ) : (
              <span>{source.sourceName}</span>
            )}
          </div>

          <div className={styles.meta}>
            <span>{source.recordCount} 筆</span>
            <Badge tone={statusTone[source.status]}>{statusLabel[source.status]}</Badge>
          </div>
        </div>
      ))}
    </div>
  </div>
);
